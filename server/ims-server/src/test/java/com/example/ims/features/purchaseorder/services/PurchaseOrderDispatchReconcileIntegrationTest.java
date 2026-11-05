package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.exception.BuildPoContextException;
import com.example.ims.support.MySqlIntegrationTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.LocalDateTime;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

/**
 * 발송 이력(SENT)과 주문 상태(NULL)가 어긋난 건을 실제 MySQL에서 맞추는지 확인한다.
 * 조회 SQL(SENT · 유예 시간 · 미전송 행 존재)과 내용 대조, 반복 실행 시 한 번만 반영되는지를 본다.
 */
class PurchaseOrderDispatchReconcileIntegrationTest extends MySqlIntegrationTest {

    @Autowired JdbcTemplate jdbc;
    @Autowired PurchaseOrderDispatchReconciler reconciler;
    @Autowired PurchaseOrderLoader loader;
    @Autowired PlatformTransactionManager transactionManager;

    @BeforeEach
    void seed() {
        for (String table : List.of("purchase_order_dispatch", "orders", "vendor_item", "vendor", "product", "`user`")) {
            jdbc.update("DELETE FROM " + table);
        }
        jdbc.update("INSERT INTO `user` (id, eid, email, name, password, status, user_rank, user_role) "
            + "VALUES (1, 'E1', 'e1@example.com', '발주 담당자', 'x', 'ACTIVE', 'EMPLOYEE', 'ALL')");
        jdbc.update("INSERT INTO vendor (id, vendor_name, status, type, email) "
            + "VALUES (2, '공급처', 'ACTIVE', 'Supplier', 'vendor@example.com')");
        jdbc.update("INSERT INTO product (id, name, product_code, type) VALUES (1, '품목1', 'P1', 'SOJU')");
        jdbc.update("INSERT INTO vendor_item (id, product_id, vendor_id, purchase_price, status) VALUES (1, 1, 2, 1000, 'ACTIVE')");
    }

    @Test
    @DisplayName("SENT인데 주문이 미전송이면 상태를 맞추고, 다시 돌려도 대상이 없다")
    void repairsSentButUnmarkedOrderOnce() {
        order(10, "PLA-SENT", "DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
        order(11, "PLA-SENT", "DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
        dispatch("PLA-SENT", "SENT", keyOf("PLA-SENT"), LocalDateTime.now().minusMinutes(10));

        PurchaseOrderDispatchReconciler.Result first = reconciler.reconcile();
        PurchaseOrderDispatchReconciler.Result second = reconciler.reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(1, 1, 0, 0, 0), first);
        assertEquals(0, second.checked());
        assertEquals(2, countStatus("PLA-SENT", "INBOUND_PENDING"));
    }

    @Test
    @DisplayName("보낸 뒤 납기 희망일이 지나도 보낸 내용과 같으면 상태를 맞춘다")
    void repairsEvenAfterReceiveDatePassed() {
        order(20, "PLA-PAST", "DATE_SUB(CURDATE(), INTERVAL 1 DAY)");
        // 전송 경로의 로더는 지난 납기일을 거부하므로, 재전송으로는 이 건의 상태를 맞출 수 없다.
        assertThrows(BuildPoContextException.class, () -> inTransaction(() -> loader.load("PLA-PAST")));
        dispatch("PLA-PAST", "SENT", inTransaction(() -> PurchaseOrderMailSender.idempotencyKey(loader.loadForReconcile("PLA-PAST"))),
            LocalDateTime.now().minusMinutes(10));

        PurchaseOrderDispatchReconciler.Result result = reconciler.reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(1, 1, 0, 0, 0), result);
        assertEquals(1, countStatus("PLA-PAST", "INBOUND_PENDING"));
    }

    @Test
    @DisplayName("보낸 뒤 수량이 바뀌었으면 상태를 바꾸지 않는다")
    void leavesOrderWhoseContentChanged() {
        order(30, "PLA-CHANGED", "DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
        dispatch("PLA-CHANGED", "SENT", keyOf("PLA-CHANGED"), LocalDateTime.now().minusMinutes(10));
        jdbc.update("UPDATE orders SET `count` = 99 WHERE order_number = 'PLA-CHANGED'");

        PurchaseOrderDispatchReconciler.Result result = reconciler.reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(1, 0, 1, 0, 0), result);
        assertEquals(1, countUnsent("PLA-CHANGED"));
    }

    @Test
    @DisplayName("방금 SENT가 된 건, SENDING·FAILED 건, 이미 상태가 바뀐 건은 대상이 아니다")
    void selectsOnlyOldSentWithUnsentRows() {
        order(40, "PLA-FRESH", "DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
        dispatch("PLA-FRESH", "SENT", keyOf("PLA-FRESH"), LocalDateTime.now());
        order(41, "PLA-SENDING", "DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
        dispatch("PLA-SENDING", "SENDING", keyOf("PLA-SENDING"), null);
        order(42, "PLA-FAILED", "DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
        dispatch("PLA-FAILED", "FAILED", keyOf("PLA-FAILED"), null);
        order(43, "PLA-DONE", "DATE_ADD(CURDATE(), INTERVAL 3 DAY)");
        dispatch("PLA-DONE", "SENT", keyOf("PLA-DONE"), LocalDateTime.now().minusMinutes(10));
        jdbc.update("UPDATE orders SET status = 'INBOUND_PENDING' WHERE order_number = 'PLA-DONE'");

        PurchaseOrderDispatchReconciler.Result result = reconciler.reconcile();

        assertEquals(0, result.checked());
        assertEquals(1, countUnsent("PLA-FRESH"));
        assertEquals(1, countUnsent("PLA-SENDING"));
        assertEquals(1, countUnsent("PLA-FAILED"));
    }

    private void order(long id, String orderNumber, String receiveDateSql) {
        jdbc.update("INSERT INTO orders (id, user_id, order_number, order_date, recieve_date, `count`, status, "
                + "vendor_item_id, product_id) "
                + "VALUES (?, 1, ?, CURDATE(), " + receiveDateSql + ", 5, NULL, 1, 1)",
            id, orderNumber);
    }

    private void dispatch(String orderNumber, String status, String key, LocalDateTime sentAt) {
        LocalDateTime updatedAt = sentAt == null ? LocalDateTime.now() : sentAt;
        jdbc.update("INSERT INTO purchase_order_dispatch "
                + "(order_number, status, idempotency_key, attempts, created_at, updated_at, sent_at) "
                + "VALUES (?, ?, ?, 1, ?, ?, ?)",
            orderNumber, status, key, updatedAt, updatedAt, sentAt);
    }

    private String keyOf(String orderNumber) {
        return inTransaction(() -> PurchaseOrderMailSender.idempotencyKey(loader.load(orderNumber)));
    }

    private <T> T inTransaction(java.util.function.Supplier<T> work) {
        return new TransactionTemplate(transactionManager).execute(status -> work.get());
    }

    private int countStatus(String orderNumber, String status) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM orders WHERE order_number = ? AND status = ?",
            Integer.class, orderNumber, status);
    }

    private int countUnsent(String orderNumber) {
        return jdbc.queryForObject("SELECT COUNT(*) FROM orders WHERE order_number = ? AND status IS NULL",
            Integer.class, orderNumber);
    }
}
