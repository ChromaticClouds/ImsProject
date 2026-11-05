package com.example.ims.features.purchaseorder.services;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

/**
 * 발송 이력과 주문 상태를 주기적으로 맞춘다. {@code ims.dispatch.reconcile.enabled=false}로 끌 수 있다.
 *
 * <p>서버가 떠 있는 동안만 돈다. 배포 서버가 유휴 시 잠드는 플랜이면 그동안은 돌지 않고, 다음에 깨어난 뒤 처리된다.
 */
@Slf4j
@Configuration
@EnableScheduling
@ConditionalOnProperty(prefix = "ims.dispatch.reconcile", name = "enabled", havingValue = "true", matchIfMissing = true)
@RequiredArgsConstructor
public class PurchaseOrderDispatchReconcileScheduler {

    private final PurchaseOrderDispatchReconciler reconciler;

    @Scheduled(
        initialDelayString = "${ims.dispatch.reconcile.initial-delay:PT1M}",
        fixedDelayString = "${ims.dispatch.reconcile.fixed-delay:PT10M}"
    )
    public void run() {
        PurchaseOrderDispatchReconciler.Result result = reconciler.reconcile();
        if (result.isEmpty()) return;

        log.info(
            "Purchase order dispatch reconcile: checked={}, repaired={}, contentChanged={}, skipped={}, failed={}",
            result.checked(), result.repaired(), result.contentChanged(), result.skipped(), result.failed()
        );
    }
}
