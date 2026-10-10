package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.entities.PurchaseOrderDispatch;
import com.example.ims.features.purchaseorder.enums.PurchaseOrderDispatchStatus;
import com.example.ims.features.purchaseorder.repositories.PurchaseOrderDispatchRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Clock;
import java.time.Duration;
import java.time.LocalDateTime;

/**
 * 발주서 발송의 상태 전이를 기록한다.
 *
 * <pre>
 *  (없음) --claim--> SENDING --markSent--> SENT
 *                       |                    (주문 상태 변경이 실패해도 SENT로 남아, 재시도 때 메일 없이 주문 상태만 맞춘다)
 *                       +--markFailed--> FAILED --claim--> SENDING
 *  SENDING이 STALE_AFTER보다 오래되면 멈춘 것으로 보고 다시 선점할 수 있다.
 * </pre>
 */
@Slf4j
@Service
public class PurchaseOrderDispatchService {

    /** 프로세스가 중간에 죽어 SENDING에 멈춘 건을 다시 가져가기까지 기다리는 시간. */
    static final Duration STALE_AFTER = Duration.ofMinutes(5);
    private static final int MAX_ERROR_LENGTH = 500;

    public enum Claim {
        /** 이 요청이 발송할 차례다. */
        ACQUIRED,
        /** 메일은 이미 나갔다. 주문 상태만 맞추면 된다. */
        ALREADY_SENT,
        /** 다른 요청이 전송 중이다. */
        IN_PROGRESS
    }

    /**
     * 선점 결과. ACQUIRED일 때만 attempt가 의미 있고, 이 번호가 이후 SENT·FAILED 전이의 소유 증표다.
     * 그사이 다른 요청이 재선점하면 번호가 달라져, 밀려난 요청은 후속 요청의 상태를 바꾸지 못한다.
     */
    public record ClaimResult(Claim claim, int attempt) {
        static ClaimResult acquired(int attempt) { return new ClaimResult(Claim.ACQUIRED, attempt); }
        static ClaimResult alreadySent() { return new ClaimResult(Claim.ALREADY_SENT, 0); }
        static ClaimResult inProgress() { return new ClaimResult(Claim.IN_PROGRESS, 0); }
    }

    private final PurchaseOrderDispatchRepository repository;
    private final Clock clock;

    @Autowired
    public PurchaseOrderDispatchService(PurchaseOrderDispatchRepository repository) {
        this(repository, Clock.systemDefaultZone());
    }

    PurchaseOrderDispatchService(PurchaseOrderDispatchRepository repository, Clock clock) {
        this.repository = repository;
        this.clock = clock;
    }

    public ClaimResult claim(String orderNumber, String idempotencyKey) {
        LocalDateTime now = LocalDateTime.now(clock);

        if (repository.insertIfAbsent(orderNumber, idempotencyKey, now) == 1) {
            return ClaimResult.acquired(1);
        }

        PurchaseOrderDispatch existing = repository.findByOrderNumber(orderNumber).orElse(null);
        if (existing == null) return ClaimResult.inProgress();
        if (existing.getStatus() == PurchaseOrderDispatchStatus.SENT) return ClaimResult.alreadySent();

        int nextAttempt = existing.getAttempts() + 1;
        int reclaimed = repository.reclaim(
            orderNumber,
            idempotencyKey,
            now,
            now.minus(STALE_AFTER),
            existing.getAttempts(),
            nextAttempt,
            PurchaseOrderDispatchStatus.SENDING,
            PurchaseOrderDispatchStatus.FAILED
        );

        return reclaimed == 1 ? ClaimResult.acquired(nextAttempt) : ClaimResult.inProgress();
    }

    public void markSent(String orderNumber, int attempt) {
        int updated = repository.markSent(
            orderNumber,
            attempt,
            LocalDateTime.now(clock),
            PurchaseOrderDispatchStatus.SENT,
            PurchaseOrderDispatchStatus.SENDING
        );
        if (updated != 1) {
            log.warn("Dispatch is no longer owned by attempt {} when marking SENT. orderNumber={}", attempt, orderNumber);
        }
    }

    /** 실패 기록 자체가 실패해도 원래 오류를 가리지 않도록 예외를 던지지 않는다. */
    public void markFailed(String orderNumber, int attempt, String reason) {
        try {
            repository.markFailed(
                orderNumber,
                attempt,
                truncate(reason),
                LocalDateTime.now(clock),
                PurchaseOrderDispatchStatus.FAILED,
                PurchaseOrderDispatchStatus.SENDING
            );
        } catch (RuntimeException e) {
            log.error("Failed to record dispatch failure. orderNumber={}", orderNumber, e);
        }
    }

    private static String truncate(String value) {
        if (value == null) return null;
        return value.length() <= MAX_ERROR_LENGTH ? value : value.substring(0, MAX_ERROR_LENGTH);
    }
}
