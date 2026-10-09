package com.example.ims.features.purchaseorder.repositories;

import com.example.ims.features.purchaseorder.entities.PurchaseOrderDispatch;
import com.example.ims.features.purchaseorder.enums.PurchaseOrderDispatchStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PurchaseOrderDispatchRepository extends JpaRepository<PurchaseOrderDispatch, Long> {

    Optional<PurchaseOrderDispatch> findByOrderNumber(String orderNumber);

    /**
     * 이력이 없을 때만 SENDING으로 새로 만든다. 이미 있으면 아무것도 하지 않고 0을 돌려준다.
     * 예외 없이 선점 여부를 알 수 있어, 동시 요청 중 한 요청만 1을 받는다.
     */
    @Modifying
    @Transactional
    @Query(
        value = """
            INSERT IGNORE INTO purchase_order_dispatch
                (order_number, status, idempotency_key, attempts, created_at, updated_at)
            VALUES (:orderNumber, 'SENDING', :idempotencyKey, 1, :now, :now)
            """,
        nativeQuery = true
    )
    int insertIfAbsent(
        @Param("orderNumber") String orderNumber,
        @Param("idempotencyKey") String idempotencyKey,
        @Param("now") LocalDateTime now
    );

    /** 실패했거나 오래 멈춘 SENDING 건만 다시 선점한다. 1이면 선점 성공. */
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("""
        update PurchaseOrderDispatch d
           set d.status = :sending,
               d.attempts = d.attempts + 1,
               d.idempotencyKey = :idempotencyKey,
               d.lastError = null,
               d.updatedAt = :now
         where d.orderNumber = :orderNumber
           and (d.status = :failed or (d.status = :sending and d.updatedAt < :staleBefore))
        """)
    int reclaim(
        @Param("orderNumber") String orderNumber,
        @Param("idempotencyKey") String idempotencyKey,
        @Param("now") LocalDateTime now,
        @Param("staleBefore") LocalDateTime staleBefore,
        @Param("sending") PurchaseOrderDispatchStatus sending,
        @Param("failed") PurchaseOrderDispatchStatus failed
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("""
        update PurchaseOrderDispatch d
           set d.status = :sent, d.sentAt = :now, d.updatedAt = :now, d.lastError = null
         where d.orderNumber = :orderNumber and d.status = :sending
        """)
    int markSent(
        @Param("orderNumber") String orderNumber,
        @Param("now") LocalDateTime now,
        @Param("sent") PurchaseOrderDispatchStatus sent,
        @Param("sending") PurchaseOrderDispatchStatus sending
    );

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("""
        update PurchaseOrderDispatch d
           set d.status = :failed, d.lastError = :lastError, d.updatedAt = :now
         where d.orderNumber = :orderNumber and d.status = :sending
        """)
    int markFailed(
        @Param("orderNumber") String orderNumber,
        @Param("lastError") String lastError,
        @Param("now") LocalDateTime now,
        @Param("failed") PurchaseOrderDispatchStatus failed,
        @Param("sending") PurchaseOrderDispatchStatus sending
    );
}
