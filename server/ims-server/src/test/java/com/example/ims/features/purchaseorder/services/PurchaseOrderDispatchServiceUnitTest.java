package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.entities.PurchaseOrderDispatch;
import com.example.ims.features.purchaseorder.enums.PurchaseOrderDispatchStatus;
import com.example.ims.features.purchaseorder.repositories.PurchaseOrderDispatchRepository;
import com.example.ims.features.purchaseorder.services.PurchaseOrderDispatchService.Claim;
import com.example.ims.features.purchaseorder.services.PurchaseOrderDispatchService.ClaimResult;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderDispatchServiceUnitTest {

    private static final Clock CLOCK =
        Clock.fixed(Instant.parse("2026-10-09T03:00:00Z"), ZoneOffset.UTC);
    private static final LocalDateTime NOW = LocalDateTime.now(CLOCK);

    @Mock PurchaseOrderDispatchRepository repository;

    @Test
    void firstRequestAcquiresTheOrderAsAttemptOne() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(1);

        ClaimResult result = service().claim("PLA-1", "key-1");

        assertEquals(Claim.ACQUIRED, result.claim());
        assertEquals(1, result.attempt());
        verify(repository, never()).findByOrderNumber(anyString());
    }

    @Test
    void sentOrderIsReportedAsAlreadySentAndNotReclaimed() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1"))
            .thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.SENT, 1)));

        assertEquals(Claim.ALREADY_SENT, service().claim("PLA-1", "key-1").claim());

        verify(repository, never())
            .reclaim(anyString(), anyString(), any(), any(), anyInt(), anyInt(), any(), any());
    }

    @Test
    void reclaimedAttemptIsOnePastTheObservedOne() {
        when(repository.insertIfAbsent("PLA-1", "key-2", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1"))
            .thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.FAILED, 2)));
        when(repository.reclaim(eq("PLA-1"), eq("key-2"), eq(NOW), any(), eq(2), eq(3), any(), any()))
            .thenReturn(1);

        ClaimResult result = service().claim("PLA-1", "key-2");

        assertEquals(Claim.ACQUIRED, result.claim());
        assertEquals(3, result.attempt());
    }

    @Test
    void freshSendingOrderIsInProgressForTheSecondRequest() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1"))
            .thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.SENDING, 1)));
        when(repository.reclaim(eq("PLA-1"), eq("key-1"), eq(NOW), any(), eq(1), eq(2), any(), any()))
            .thenReturn(0);

        assertEquals(Claim.IN_PROGRESS, service().claim("PLA-1", "key-1").claim());
    }

    @Test
    void losingTheReclaimRaceToAnotherRequestIsInProgress() {
        // 읽은 뒤 다른 요청이 먼저 재선점하면 시도 번호가 달라 조건부 UPDATE가 0건이 된다.
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1"))
            .thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.FAILED, 1)));
        when(repository.reclaim(eq("PLA-1"), eq("key-1"), eq(NOW), any(), eq(1), eq(2), any(), any()))
            .thenReturn(0);

        ClaimResult result = service().claim("PLA-1", "key-1");

        assertEquals(Claim.IN_PROGRESS, result.claim());
    }

    @Test
    void reclaimTreatsSendingOlderThanFiveMinutesAsStale() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1"))
            .thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.SENDING, 1)));

        service().claim("PLA-1", "key-1");

        ArgumentCaptor<LocalDateTime> staleBefore = ArgumentCaptor.forClass(LocalDateTime.class);
        verify(repository).reclaim(
            eq("PLA-1"), eq("key-1"), eq(NOW), staleBefore.capture(), eq(1), eq(2),
            eq(PurchaseOrderDispatchStatus.SENDING), eq(PurchaseOrderDispatchStatus.FAILED)
        );
        assertEquals(NOW.minusMinutes(5), staleBefore.getValue());
    }

    @Test
    void terminalTransitionsAreScopedToTheOwningAttempt() {
        service().markSent("PLA-1", 3);
        service().markFailed("PLA-1", 3, "mail down");

        verify(repository).markSent(
            eq("PLA-1"), eq(3), eq(NOW),
            eq(PurchaseOrderDispatchStatus.SENT), eq(PurchaseOrderDispatchStatus.SENDING)
        );
        verify(repository).markFailed(
            eq("PLA-1"), eq(3), eq("mail down"), eq(NOW),
            eq(PurchaseOrderDispatchStatus.FAILED), eq(PurchaseOrderDispatchStatus.SENDING)
        );
    }

    @Test
    void failureReasonIsTruncatedToTheColumnLength() {
        service().markFailed("PLA-1", 1, "x".repeat(900));

        ArgumentCaptor<String> reason = ArgumentCaptor.forClass(String.class);
        verify(repository).markFailed(
            eq("PLA-1"), eq(1), reason.capture(), eq(NOW),
            eq(PurchaseOrderDispatchStatus.FAILED), eq(PurchaseOrderDispatchStatus.SENDING)
        );
        assertEquals(500, reason.getValue().length());
    }

    @Test
    void recordingAFailureNeverThrowsSoTheOriginalErrorSurvives() {
        when(repository.markFailed(anyString(), anyInt(), any(), any(), any(), any()))
            .thenThrow(new IllegalStateException("db down"));

        assertDoesNotThrow(() -> service().markFailed("PLA-1", 1, "mail down"));
    }

    private PurchaseOrderDispatchService service() {
        return new PurchaseOrderDispatchService(repository, CLOCK);
    }

    private PurchaseOrderDispatch existing(PurchaseOrderDispatchStatus status, int attempts) {
        PurchaseOrderDispatch dispatch = new PurchaseOrderDispatch();
        ReflectionTestUtils.setField(dispatch, "status", status);
        ReflectionTestUtils.setField(dispatch, "attempts", attempts);
        return dispatch;
    }
}
