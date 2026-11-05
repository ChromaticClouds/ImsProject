package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.purchaseorder.entities.PurchaseOrderDispatch;
import com.example.ims.features.purchaseorder.enums.PurchaseOrderDispatchStatus;
import com.example.ims.features.purchaseorder.exception.PurchaseOrderAlreadySentException;
import com.example.ims.features.purchaseorder.mappers.PurchaseOrderMapper;
import com.example.ims.features.purchaseorder.repositories.PurchaseOrderDispatchRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.support.TransactionOperations;
import org.springframework.transaction.support.TransactionTemplate;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;

/**
 * 발송 이력은 SENT인데 주문 상태가 아직 미전송(NULL)으로 남은 건을 찾아 주문 상태만 맞춘다.
 *
 * <p>메일 호출 뒤 주문 상태 변경이 실패한 경우다. 지금까지는 같은 발주서를 다시 전송해야 정리됐다.
 * 메일은 다시 보내지 않는다.
 *
 * <p>다루지 않는 것:
 * <ul>
 *   <li>SENDING에 남은 건: 메일이 나갔는지 알 수 없어 재발송 정책 없이 자동으로 정할 수 없다.
 *       지금처럼 5분 뒤 다음 전송 요청이 넘겨받는다.</li>
 *   <li>보낸 뒤 내용(수신처·납기일·항목·수량)이 바뀐 건: 지금 DB 내용으로 만든 멱등 키가 이력의 키와 다르면
 *       보낸 메일과 지금 주문이 다르다는 뜻이라 상태를 바꾸지 않고 경고만 남긴다.</li>
 * </ul>
 *
 * <p>건마다 짧은 트랜잭션 하나로 읽고 바꾼다. 주기 작업에는 웹 요청처럼 열려 있는 영속성 세션이 없어,
 * 트랜잭션 없이 읽으면 주문의 담당자·공급처 지연 로딩이 실패한다. 메일 호출은 없으므로 트랜잭션이 길어지지 않는다.
 *
 * <p>주문 상태 변경은 {@code status IS NULL} 조건이 붙은 UPDATE라, 전송 요청이나 다른 인스턴스와 동시에 돌아도
 * 한 번만 반영된다.
 */
@Slf4j
@Service
public class PurchaseOrderDispatchReconciler {

    /** 방금 SENT가 된 건은 그 요청이 곧 주문 상태를 바꾸므로 잠시 기다린다. */
    static final Duration GRACE = Duration.ofMinutes(1);
    static final int BATCH_SIZE = 100;

    public record Result(int checked, int repaired, int contentChanged, int skipped, int failed) {
        public boolean isEmpty() {
            return checked == 0;
        }
    }

    private enum Outcome { REPAIRED, CONTENT_CHANGED, SKIPPED }

    private final PurchaseOrderMapper mapper;
    private final PurchaseOrderDispatchRepository dispatches;
    private final PurchaseOrderLoader loader;
    private final TransactionOperations transactions;
    private final Clock clock;

    @Autowired
    public PurchaseOrderDispatchReconciler(
        PurchaseOrderMapper mapper,
        PurchaseOrderDispatchRepository dispatches,
        PurchaseOrderLoader loader,
        PlatformTransactionManager transactionManager
    ) {
        this(mapper, dispatches, loader, new TransactionTemplate(transactionManager), Clock.systemDefaultZone());
    }

    PurchaseOrderDispatchReconciler(
        PurchaseOrderMapper mapper,
        PurchaseOrderDispatchRepository dispatches,
        PurchaseOrderLoader loader,
        TransactionOperations transactions,
        Clock clock
    ) {
        this.mapper = mapper;
        this.dispatches = dispatches;
        this.loader = loader;
        this.transactions = transactions;
        this.clock = clock;
    }

    public Result reconcile() {
        LocalDateTime sentBefore = LocalDateTime.now(clock).minus(GRACE);
        List<String> candidates = mapper.selectSentButUnmarkedOrderNumbers(sentBefore, BATCH_SIZE);

        int repaired = 0;
        int contentChanged = 0;
        int skipped = 0;
        int failed = 0;

        for (String orderNumber : candidates) {
            try {
                switch (transactions.execute(status -> reconcileOne(orderNumber))) {
                    case REPAIRED -> repaired++;
                    case CONTENT_CHANGED -> contentChanged++;
                    case SKIPPED -> skipped++;
                }
            } catch (RuntimeException e) {
                // 한 건의 오류로 나머지 건까지 멈추지 않는다.
                failed++;
                log.error("Failed to reconcile purchase order status. orderNumber={}", orderNumber, e);
            }
        }

        return new Result(candidates.size(), repaired, contentChanged, skipped, failed);
    }

    private Outcome reconcileOne(String orderNumber) {
        PurchaseOrderDispatch dispatch = dispatches.findByOrderNumber(orderNumber).orElse(null);
        if (dispatch == null || dispatch.getStatus() != PurchaseOrderDispatchStatus.SENT) return Outcome.SKIPPED;

        PurchaseOrderContext context;
        try {
            context = loader.loadForReconcile(orderNumber);
        } catch (PurchaseOrderAlreadySentException e) {
            // 조회와 지금 사이에 전송 요청이 먼저 상태를 맞췄다.
            return Outcome.SKIPPED;
        }

        if (!PurchaseOrderMailSender.idempotencyKey(context).equals(dispatch.getIdempotencyKey())) {
            log.warn(
                "Purchase order changed after it was sent; leaving status for manual review. orderNumber={}",
                orderNumber
            );
            return Outcome.CONTENT_CHANGED;
        }

        return mapper.markSentByOrderNumber(orderNumber) > 0 ? Outcome.REPAIRED : Outcome.SKIPPED;
    }
}
