package com.example.ims.features.purchaseorder.entities;

import com.example.ims.features.purchaseorder.enums.PurchaseOrderDispatchStatus;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * 발주번호당 한 건인 발송 이력.
 * order_number 유니크 키가 "누가 이 발주서를 보낼지"를 정하는 선점 장치이고,
 * 메일이 나갔는지(SENT)는 주문 상태(orders.status)와 별개로 기록한다.
 */
@Entity
@Table(
    name = "purchase_order_dispatch",
    uniqueConstraints = @UniqueConstraint(
        name = "uk_purchase_order_dispatch_order_number",
        columnNames = "order_number"
    )
)
@Getter
@NoArgsConstructor
public class PurchaseOrderDispatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "order_number", nullable = false, length = 255)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private PurchaseOrderDispatchStatus status;

    @Column(name = "idempotency_key", nullable = false, length = 255)
    private String idempotencyKey;

    @Column(nullable = false)
    private int attempts;

    @Column(name = "last_error", length = 500)
    private String lastError;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "sent_at")
    private LocalDateTime sentAt;
}
