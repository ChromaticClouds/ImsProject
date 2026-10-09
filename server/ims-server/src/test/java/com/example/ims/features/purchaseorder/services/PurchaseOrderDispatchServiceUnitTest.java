package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.entities.PurchaseOrderDispatch;
import com.example.ims.features.purchaseorder.enums.PurchaseOrderDispatchStatus;
import com.example.ims.features.purchaseorder.repositories.PurchaseOrderDispatchRepository;
import com.example.ims.features.purchaseorder.services.PurchaseOrderDispatchService.Claim;
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

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.mockito.ArgumentMatchers.any;
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
    void firstRequestAcquiresTheOrder() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(1);

        assertEquals(Claim.ACQUIRED, service().claim("PLA-1", "key-1"));

        verify(repository, never()).findByOrderNumber(anyString());
    }

    @Test
    void sentOrderIsReportedAsAlreadySentAndNotReclaimed() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1")).thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.SENT)));

        assertEquals(Claim.ALREADY_SENT, service().claim("PLA-1", "key-1"));

        verify(repository, never()).reclaim(anyString(), anyString(), any(), any(), any(), any());
    }

    @Test
    void failedOrderCanBeReclaimed() {
        when(repository.insertIfAbsent("PLA-1", "key-2", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1")).thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.FAILED)));
        when(repository.reclaim(eq("PLA-1"), eq("key-2"), eq(NOW), any(), any(), any())).thenReturn(1);

        assertEquals(Claim.ACQUIRED, service().claim("PLA-1", "key-2"));
    }

    @Test
    void freshSendingOrderIsInProgressForTheSecondRequest() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1")).thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.SENDING)));
        when(repository.reclaim(eq("PLA-1"), eq("key-1"), eq(NOW), any(), any(), any())).thenReturn(0);

        assertEquals(Claim.IN_PROGRESS, service().claim("PLA-1", "key-1"));
    }

    @Test
    void reclaimTreatsSendingOlderThanFiveMinutesAsStale() {
        when(repository.insertIfAbsent("PLA-1", "key-1", NOW)).thenReturn(0);
        when(repository.findByOrderNumber("PLA-1")).thenReturn(Optional.of(existing(PurchaseOrderDispatchStatus.SENDING)));

        service().claim("PLA-1", "key-1");

        ArgumentCaptor<LocalDateTime> staleBefore = ArgumentCaptor.forClass(LocalDateTime.class);
        verify(repository).reclaim(
            eq("PLA-1"), eq("key-1"), eq(NOW), staleBefore.capture(),
            eq(PurchaseOrderDispatchStatus.SENDING), eq(PurchaseOrderDispatchStatus.FAILED)
        );
        assertEquals(NOW.minusMinutes(5), staleBefore.getValue());
    }

    @Test
    void failureReasonIsTruncatedToTheColumnLength() {
        service().markFailed("PLA-1", "x".repeat(900));

        ArgumentCaptor<String> reason = ArgumentCaptor.forClass(String.class);
        verify(repository).markFailed(
            eq("PLA-1"), reason.capture(), eq(NOW),
            eq(PurchaseOrderDispatchStatus.FAILED), eq(PurchaseOrderDispatchStatus.SENDING)
        );
        assertEquals(500, reason.getValue().length());
    }

    @Test
    void recordingAFailureNeverThrowsSoTheOriginalErrorSurvives() {
        when(repository.markFailed(anyString(), any(), any(), any(), any()))
            .thenThrow(new IllegalStateException("db down"));

        assertDoesNotThrow(() -> service().markFailed("PLA-1", "mail down"));
    }

    private PurchaseOrderDispatchService service() {
        return new PurchaseOrderDispatchService(repository, CLOCK);
    }

    private PurchaseOrderDispatch existing(PurchaseOrderDispatchStatus status) {
        PurchaseOrderDispatch dispatch = new PurchaseOrderDispatch();
        ReflectionTestUtils.setField(dispatch, "status", status);
        return dispatch;
    }
}
