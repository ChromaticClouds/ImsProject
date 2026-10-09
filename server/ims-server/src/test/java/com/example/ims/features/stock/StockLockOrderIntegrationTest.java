package com.example.ims.features.stock;

import com.example.ims.features.inbound.service.InboundQueryService;
import com.example.ims.features.outbound.service.OutboundQueryService;
import com.example.ims.features.inbound.dto.PendingUpdateRequest;
import com.example.ims.support.MySqlIntegrationTest;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.RepeatedTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

/**
 * 같은 품목들을 서로 반대 순서로 가진 두 완료 작업이 동시에 들어와도 교착이 나지 않아야 한다.
 *
 * <p>재고 행은 품목별로 하나씩 잠기므로, 두 트랜잭션이 같은 재고 행을 서로 반대 순서로 잠그면
 * 각자 상대가 가진 행을 기다리며 교착이 된다. 재고 행에 쓰기가 일어나는 순간에 지연을 넣어
 * 두 트랜잭션이 첫 행을 잡은 채 만나는 상황을 항상 만든다.
 */
class StockLockOrderIntegrationTest extends MySqlIntegrationTest {

    private static final long ACTOR = 1L;

    // 경합하는 두 품목. INSERT ... ON DUPLICATE KEY UPDATE는 중복 확인 때 인덱스의 다음 레코드에도 락을 걸기 때문에,
    // 품목 id가 인접하면 두 트랜잭션이 교착 대신 한쪽이 처음부터 기다리게 되어 재현이 흔들린다.
    // 그래서 두 품목 사이와 뒤에 아무도 건드리지 않는 재고 행(FILLER)을 끼워 둔다.
    private static final long A = 10L;
    private static final long B = 30L;
    private static final long C = 50L;
    private static final List<Long> FILLERS = List.of(20L, 40L, 60L, 80L);
    private static final long WARM = 70L;

    @Autowired JdbcTemplate jdbc;
    @Autowired OutboundQueryService outbound;
    @Autowired InboundQueryService inbound;

    @BeforeEach
    void seed() {
        addColumnsOnlyMyBatisKnows();
        clear();

        jdbc.update("INSERT INTO `user` (id, eid, email, name, password, status, user_rank, user_role) "
            + "VALUES (1, 'E1', 'e1@example.com', '작업자', 'x', 'ACTIVE', 'EMPLOYEE', 'ALL')");
        jdbc.update("INSERT INTO vendor (id, vendor_name, status, type) VALUES (1, '판매처', 'ACTIVE', 'Seller')");
        jdbc.update("INSERT INTO vendor (id, vendor_name, status, type) VALUES (2, '공급처', 'ACTIVE', 'Supplier')");
        List<Long> products = new java.util.ArrayList<>(List.of(A, B, C, WARM));
        products.addAll(FILLERS);
        for (long id : products) {
            jdbc.update("INSERT INTO product (id, name, product_code, type) VALUES (?, ?, ?, 'SOJU')", id, "품목" + id, "P" + id);
            jdbc.update("INSERT INTO vendor_item (id, product_id, vendor_id, purchase_price, status) VALUES (?, ?, 2, 1000, 'ACTIVE')", id, id);
            jdbc.update("INSERT INTO stock (id, product_id, `count`) VALUES (?, ?, 100)", id, id);
        }

        // 두 작업은 같은 품목 A, B를 서로 반대 순서로 가진다. 주문 행 id 순서로 읽으면
        // X는 A -> B, Y는 B -> A 순서가 된다.
        outboundRow(10, "OUT-X", A);
        outboundRow(11, "OUT-X", B);
        outboundRow(12, "OUT-X", C);
        outboundRow(19, "OUT-Y", C);
        outboundRow(20, "OUT-Y", B);
        outboundRow(21, "OUT-Y", A);
        inboundRow(30, "IN-X", A);
        inboundRow(31, "IN-X", B);
        inboundRow(32, "IN-X", C);
        inboundRow(39, "IN-Y", C);
        inboundRow(40, "IN-Y", B);
        inboundRow(41, "IN-Y", A);
        // 웜업 전용 품목: 첫 호출의 초기화 시간(MyBatis 문장 준비 등)이 두 트랜잭션의 시작 간격을 벌리지 않게 한다.
        outboundRow(50, "OUT-WARM", WARM);
        inboundRow(60, "IN-WARM", WARM);
        outbound.completeByOrderNumberAndWriteHistory("OUT-WARM", null, ACTOR);
        inbound.markCompleteByOrderNumberAndWriteHistory("IN-WARM", null, ACTOR);

        // 재고 수량이 실제로 바뀌는 갱신에서만 잠시 멈춰, 두 트랜잭션이 첫 행을 쥔 채 서로 만나게 한다.
        // ensureStockRow(INSERT ... ON DUPLICATE KEY UPDATE)도 이 트리거를 거치지만 수량을 바꾸지 않으므로 멈추지 않는다.
        // 거기서 멈추면 INSERT끼리 stock 인덱스 끝 락으로 먼저 직렬화되어 교착 구간에 닿지 못한다.
        jdbc.execute("DROP TRIGGER IF EXISTS stock_update_delay");
        jdbc.execute("DROP TRIGGER IF EXISTS history_insert_failure");
        jdbc.execute("DROP TRIGGER IF EXISTS order_status_change");
        jdbc.execute("CREATE TRIGGER stock_update_delay BEFORE UPDATE ON stock FOR EACH ROW BEGIN "
            + "IF NEW.`count` <> OLD.`count` THEN SET @delay = SLEEP(0.2); END IF; END");
    }

    @AfterEach
    void removeDelay() {
        jdbc.execute("DROP TRIGGER IF EXISTS stock_update_delay");
        jdbc.execute("DROP TRIGGER IF EXISTS history_insert_failure");
        jdbc.execute("DROP TRIGGER IF EXISTS order_status_change");
    }

    @RepeatedTest(10)
    void outboundCompletionsInOppositeProductOrderDoNotDeadlock() throws Exception {
        List<Throwable> failures = runConcurrently(
            () -> outbound.completeByOrderNumberAndWriteHistory("OUT-X", null, ACTOR),
            () -> outbound.completeByOrderNumberAndWriteHistory("OUT-Y", null, ACTOR)
        );

        assertNoFailure(failures);
        assertEquals(98, stockCount(A));
        assertEquals(98, stockCount(B));
        assertEquals(98, stockCount(C));
        assertHistoryChain(-1, 2);
        assertEquals(6, jdbc.queryForObject(
            "SELECT COUNT(*) FROM orders WHERE status = 'OUTBOUND_COMPLETE' AND order_number <> 'OUT-WARM'", Integer.class));
    }

    @RepeatedTest(10)
    void inboundCompletionsInOppositeProductOrderDoNotDeadlock() throws Exception {
        List<Throwable> failures = runConcurrently(
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", null, ACTOR),
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-Y", null, ACTOR)
        );

        assertNoFailure(failures);
        assertEquals(102, stockCount(A));
        assertEquals(102, stockCount(B));
        assertEquals(102, stockCount(C));
        assertHistoryChain(1, 2);
        assertEquals(6, jdbc.queryForObject(
            "SELECT COUNT(*) FROM orders WHERE status = 'INBOUND_COMPLETE' AND order_number <> 'IN-WARM'", Integer.class));
    }

    @RepeatedTest(10)
    void mixedInboundAndOutboundInOppositeOrderPreserveHistoryAndStock() throws Exception {
        assertNoFailure(runConcurrently(
            () -> outbound.completeByOrderNumberAndWriteHistory("OUT-X", null, ACTOR),
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-Y", null, ACTOR)));
        for (long product : List.of(A, B, C)) {
            assertEquals(100, stockCount(product));
            var history = historyCounts(product);
            assertEquals(2, history.size());
            assertEquals(100, history.getFirst().get(0));
            assertEquals(history.getFirst().get(1), history.getLast().get(0));
            assertEquals(100, history.getLast().get(1));
            assertEquals(1, Math.abs(history.getFirst().get(1) - history.getFirst().get(0)));
        }
        assertEquals(3, orderStatusCount("OUT-X", "OUTBOUND_COMPLETE"));
        assertEquals(3, orderStatusCount("IN-Y", "INBOUND_COMPLETE"));
    }

    @Test
    void concurrentInboundCreatesMissingStockRowsOnlyOnce() throws Exception {
        jdbc.update("DELETE FROM stock WHERE product_id IN (?, ?, ?)", A, B, C);
        assertNoFailure(runConcurrently(
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", null, ACTOR),
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-Y", null, ACTOR)));
        for (long product : List.of(A, B, C)) {
            assertEquals(2, stockCount(product));
            assertEquals(1, jdbc.queryForObject("SELECT COUNT(*) FROM stock WHERE product_id = ?", Integer.class, product));
            assertEquals(List.of(List.of(0, 1), List.of(1, 2)), historyCounts(product));
        }
    }

    @Test
    void duplicateOutboundItemsHaveContinuousBeforeAndAfterCounts() {
        outboundRow(13, "OUT-X", A);
        outbound.completeByOrderNumberAndWriteHistory("OUT-X", null, ACTOR);
        assertEquals(98, stockCount(A));
        assertEquals(List.of(List.of(100, 99), List.of(99, 98)), historyCounts(A));
        assertEquals(4, orderStatusCount("OUT-X", "OUTBOUND_COMPLETE"));
    }

    @Test
    void receivedQuantityOverrideKeepsChangedBadgeAndHistory() {
        var request = PendingUpdateRequest.builder().items(List.of(
            PendingUpdateRequest.Item.builder().orderId(30L).orderQty(3).build())).build();
        inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", request, ACTOR);
        assertEquals(103, stockCount(A));
        assertEquals(List.of(List.of(100, 103)), historyCounts(A));
        assertEquals(1, jdbc.queryForObject("SELECT qty_changed FROM orders WHERE id = 30", Integer.class));
        assertEquals(3, orderStatusCount("IN-X", "INBOUND_COMPLETE"));
    }

    @Test
    void invalidLaterQuantityLeavesEveryItemUnchanged() {
        jdbc.update("UPDATE orders SET `count` = 0 WHERE id IN (11, 31)");
        assertThrows(IllegalArgumentException.class,
            () -> outbound.completeByOrderNumberAndWriteHistory("OUT-X", null, ACTOR));
        assertThrows(IllegalArgumentException.class,
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", null, ACTOR));
        for (long product : List.of(A, B, C)) assertEquals(100, stockCount(product));
        assertNoCompletionWrites("OUT-X", "OUTBOUND_PENDING");
        assertNoCompletionWrites("IN-X", "INBOUND_PENDING");
    }

    @Test
    void inboundOverflowOnLaterItemRollsBackAllWrites() {
        jdbc.update("UPDATE stock SET `count` = ? WHERE product_id = ?", Integer.MAX_VALUE, B);
        assertThrows(ArithmeticException.class,
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", null, ACTOR));
        assertEquals(100, stockCount(A));
        assertEquals(Integer.MAX_VALUE, stockCount(B));
        assertEquals(100, stockCount(C));
        assertNoCompletionWrites("IN-X", "INBOUND_PENDING");
    }

    @Test
    void differentVendorItemsForSameProductHaveContinuousInboundHistory() {
        jdbc.update("INSERT INTO vendor_item (id, product_id, vendor_id, purchase_price, status) VALUES (90, ?, 2, 1000, 'ACTIVE')", A);
        inboundRow(33, "IN-X", 90L);
        inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", null, ACTOR);
        assertEquals(102, stockCount(A));
        assertEquals(List.of(List.of(100, 101), List.of(101, 102)), historyCounts(A));
        assertEquals(4, orderStatusCount("IN-X", "INBOUND_COMPLETE"));
    }

    @Test
    void insufficientStockOnLaterItemRollsBackEarlierUpdatesAndHistory() {
        jdbc.update("UPDATE stock SET `count` = 0 WHERE product_id = ?", B);
        assertThrows(IllegalArgumentException.class,
            () -> outbound.completeByOrderNumberAndWriteHistory("OUT-X", null, ACTOR));
        assertEquals(100, stockCount(A));
        assertEquals(0, stockCount(B));
        assertEquals(100, stockCount(C));
        assertNoCompletionWrites("OUT-X", "OUTBOUND_PENDING");
    }

    @Test
    void historyInsertExceptionRollsBackBothCompletionPaths() {
        jdbc.execute("CREATE TRIGGER history_insert_failure BEFORE INSERT ON history FOR EACH ROW BEGIN "
            + "IF NEW.product_id = " + B + " THEN SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'injected history failure'; END IF; END");
        assertThrows(RuntimeException.class,
            () -> outbound.completeByOrderNumberAndWriteHistory("OUT-X", null, ACTOR));
        assertThrows(RuntimeException.class,
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", null, ACTOR));
        for (long product : List.of(A, B, C)) assertEquals(100, stockCount(product));
        assertNoCompletionWrites("OUT-X", "OUTBOUND_PENDING");
        assertNoCompletionWrites("IN-X", "INBOUND_PENDING");
    }

    @Test
    void partialOrderStatusUpdateRollsBackBothCompletionPaths() {
        jdbc.execute("CREATE TRIGGER order_status_change BEFORE INSERT ON history FOR EACH ROW BEGIN "
            + "IF NEW.product_id = " + B + " THEN UPDATE orders SET status = "
            + "CASE WHEN status = 'OUTBOUND_PENDING' THEN 'OUTBOUND_COMPLETE' ELSE 'INBOUND_COMPLETE' END "
            + "WHERE product_id = " + B + " OR vendor_item_id = " + B + "; END IF; END");
        assertThrows(IllegalStateException.class,
            () -> outbound.completeByOrderNumberAndWriteHistory("OUT-X", null, ACTOR));
        assertThrows(IllegalStateException.class,
            () -> inbound.markCompleteByOrderNumberAndWriteHistory("IN-X", null, ACTOR));
        for (long product : List.of(A, B, C)) assertEquals(100, stockCount(product));
        assertNoCompletionWrites("OUT-X", "OUTBOUND_PENDING");
        assertNoCompletionWrites("IN-X", "INBOUND_PENDING");
    }

    private int orderStatusCount(String orderNumber, String status) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM orders WHERE order_number = ? AND status = ?", Integer.class, orderNumber, status);
    }

    private void assertNoCompletionWrites(String orderNumber, String pendingStatus) {
        assertEquals(3, orderStatusCount(orderNumber, pendingStatus));
        assertEquals(0, jdbc.queryForObject("SELECT COUNT(*) FROM history_lot WHERE order_number = ?", Integer.class, orderNumber));
        for (long product : List.of(A, B, C)) assertTrue(historyCounts(product).isEmpty());
    }

    private List<List<Integer>> historyCounts(long productId) {
        return jdbc.query("SELECT before_count, after_count FROM history WHERE product_id = ? ORDER BY id",
            (rs, index) -> List.of(rs.getInt(1), rs.getInt(2)), productId);
    }

    private void assertHistoryChain(int change, int numberOfRows) {
        for (long product : List.of(A, B, C)) {
            var history = historyCounts(product);
            assertEquals(numberOfRows, history.size());
            int before = 100;
            for (var row : history) {
                assertEquals(before, row.get(0));
                assertEquals(before + change, row.get(1));
                before += change;
            }
        }
    }

    @FunctionalInterface
    private interface Task {
        void run() throws Exception;
    }

    private List<Throwable> runConcurrently(Task first, Task second) throws Exception {
        ExecutorService pool = Executors.newFixedThreadPool(2);
        CyclicBarrier start = new CyclicBarrier(2);
        try {
            Future<Throwable> a = pool.submit(() -> run(start, first));
            Future<Throwable> b = pool.submit(() -> run(start, second));
            // 성공한 쪽은 null이라 List.of를 쓸 수 없다.
            return Arrays.asList(result(a), result(b));
        } finally {
            pool.shutdownNow();
        }
    }

    private Throwable run(CyclicBarrier start, Task task) throws Exception {
        start.await(10, TimeUnit.SECONDS);
        try {
            task.run();
            return null;
        } catch (Throwable t) {
            return t;
        }
    }

    private Throwable result(Future<Throwable> future) throws InterruptedException, ExecutionException, java.util.concurrent.TimeoutException {
        return future.get(60, TimeUnit.SECONDS);
    }

    private void assertNoFailure(List<Throwable> failures) {
        for (Throwable failure : failures) {
            assertNull(failure, () -> "동시 완료 중 하나가 실패했다: " + failure);
        }
    }

    private int stockCount(long productId) {
        return jdbc.queryForObject("SELECT `count` FROM stock WHERE product_id = ?", Integer.class, productId);
    }

    private void outboundRow(long id, String orderNumber, long productId) {
        jdbc.update("INSERT INTO orders (id, user_id, order_number, order_date, recieve_date, `count`, status, "
                + "product_id, seller_vendor_id, manager_id) "
                + "VALUES (?, 1, ?, CURDATE(), CURDATE(), 1, 'OUTBOUND_PENDING', ?, 1, 1)",
            id, orderNumber, productId);
    }

    private void inboundRow(long id, String orderNumber, long vendorItemId) {
        jdbc.update("INSERT INTO orders (id, user_id, order_number, order_date, recieve_date, `count`, status, "
                + "vendor_item_id, manager_id) "
                + "VALUES (?, 1, ?, CURDATE(), CURDATE(), 1, 'INBOUND_PENDING', ?, 1)",
            id, orderNumber, vendorItemId);
    }

    private void clear() {
        for (String table : List.of("history", "history_lot", "orders", "stock", "vendor_item", "vendor", "product", "`user`")) {
            jdbc.update("DELETE FROM " + table);
        }
    }

    /** 엔티티에는 없지만 MyBatis SQL이 쓰는 컬럼. 엔티티에 매핑되면 이 보정은 필요 없어진다. */
    private void addColumnsOnlyMyBatisKnows() {
        addColumnIfMissing("history", "seller_vendor_id", "BIGINT NULL");
        addColumnIfMissing("orders", "qty_changed", "INT NULL");
    }

    private void addColumnIfMissing(String table, String column, String definition) {
        Integer exists = jdbc.queryForObject(
            "SELECT COUNT(*) FROM information_schema.columns "
                + "WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?",
            Integer.class, table, column);
        if (exists != null && exists == 0) {
            jdbc.execute("ALTER TABLE " + table + " ADD COLUMN " + column + " " + definition);
        }
    }
}
