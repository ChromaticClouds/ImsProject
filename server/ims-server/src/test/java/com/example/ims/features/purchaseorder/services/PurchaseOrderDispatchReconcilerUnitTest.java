package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.purchaseorder.entities.PurchaseOrderDispatch;
import com.example.ims.features.purchaseorder.enums.PurchaseOrderDispatchStatus;
import com.example.ims.features.purchaseorder.exception.PurchaseOrderAlreadySentException;
import com.example.ims.features.purchaseorder.mappers.PurchaseOrderMapper;
import com.example.ims.features.purchaseorder.repositories.PurchaseOrderDispatchRepository;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.transaction.support.TransactionOperations;

import java.time.Clock;
import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderDispatchReconcilerUnitTest {

    private static final ZoneId ZONE = ZoneId.of("Asia/Seoul");
    private static final Instant NOW = Instant.parse("2026-11-05T01:00:00Z");

    @Mock PurchaseOrderMapper mapper;
    @Mock PurchaseOrderDispatchRepository dispatches;
    @Mock PurchaseOrderLoader loader;

    private PurchaseOrderDispatchReconciler reconciler() {
        return new PurchaseOrderDispatchReconciler(
            mapper, dispatches, loader, TransactionOperations.withoutTransaction(), Clock.fixed(NOW, ZONE));
    }

    @Test
    @DisplayName("Given SENT 이력과 미전송 주문 When 일치화 Then 메일 없이 주문 상태만 바꾼다")
    void reconcile_GivenSentDispatchAndUnsentOrders_ThenMarksOrdersSent() {
        PurchaseOrderContext ctx = context("PLA-1");
        PurchaseOrderDispatch dispatch = dispatch(PurchaseOrderDispatchStatus.SENT, PurchaseOrderMailSender.idempotencyKey(ctx));

        when(mapper.selectSentButUnmarkedOrderNumbers(LocalDateTime.ofInstant(NOW, ZONE).minus(PurchaseOrderDispatchReconciler.GRACE), PurchaseOrderDispatchReconciler.BATCH_SIZE))
            .thenReturn(List.of("PLA-1"));
        when(dispatches.findByOrderNumber("PLA-1")).thenReturn(Optional.of(dispatch));
        when(loader.loadForReconcile("PLA-1")).thenReturn(ctx);
        when(mapper.markSentByOrderNumber("PLA-1")).thenReturn(1);

        PurchaseOrderDispatchReconciler.Result result = reconciler().reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(1, 1, 0, 0, 0), result);
        verify(mapper).markSentByOrderNumber("PLA-1");
    }

    @Test
    @DisplayName("Given 보낸 뒤 내용이 바뀐 발주서 When 일치화 Then 상태를 바꾸지 않고 내용 변경으로 센다")
    void reconcile_GivenContentChangedAfterSend_ThenLeavesStatus() {
        PurchaseOrderContext ctx = context("PLA-2");
        PurchaseOrderDispatch dispatch = dispatch(PurchaseOrderDispatchStatus.SENT, "po-PLA-2-differentkey00");

        when(mapper.selectSentButUnmarkedOrderNumbers(org.mockito.ArgumentMatchers.any(), anyInt())).thenReturn(List.of("PLA-2"));
        when(dispatches.findByOrderNumber("PLA-2")).thenReturn(Optional.of(dispatch));
        when(loader.loadForReconcile("PLA-2")).thenReturn(ctx);

        PurchaseOrderDispatchReconciler.Result result = reconciler().reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(1, 0, 1, 0, 0), result);
        verify(mapper, never()).markSentByOrderNumber(anyString());
    }

    @Test
    @DisplayName("Given 조회 뒤 전송 요청이 먼저 상태를 맞춤 When 일치화 Then 건너뛴다")
    void reconcile_GivenAlreadyMarkedMeanwhile_ThenSkips() {
        PurchaseOrderDispatch dispatch = dispatch(PurchaseOrderDispatchStatus.SENT, "po-PLA-3-key");

        when(mapper.selectSentButUnmarkedOrderNumbers(org.mockito.ArgumentMatchers.any(), anyInt())).thenReturn(List.of("PLA-3"));
        when(dispatches.findByOrderNumber("PLA-3")).thenReturn(Optional.of(dispatch));
        when(loader.loadForReconcile("PLA-3")).thenThrow(new PurchaseOrderAlreadySentException());

        PurchaseOrderDispatchReconciler.Result result = reconciler().reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(1, 0, 0, 1, 0), result);
        verify(mapper, never()).markSentByOrderNumber(anyString());
    }

    @Test
    @DisplayName("Given 이력이 SENT가 아님 When 일치화 Then 건너뛴다")
    void reconcile_GivenDispatchNotSent_ThenSkips() {
        PurchaseOrderDispatch dispatch = dispatch(PurchaseOrderDispatchStatus.SENDING, "po-PLA-4-key");

        when(mapper.selectSentButUnmarkedOrderNumbers(org.mockito.ArgumentMatchers.any(), anyInt())).thenReturn(List.of("PLA-4"));
        when(dispatches.findByOrderNumber("PLA-4")).thenReturn(Optional.of(dispatch));

        PurchaseOrderDispatchReconciler.Result result = reconciler().reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(1, 0, 0, 1, 0), result);
        verify(loader, never()).load(anyString());
    }

    @Test
    @DisplayName("Given 한 건에서 오류 When 일치화 Then 나머지 건은 계속 처리한다")
    void reconcile_GivenOneFailure_ThenContinuesWithOthers() {
        PurchaseOrderContext ok = context("PLA-OK");
        PurchaseOrderDispatch okDispatch = dispatch(PurchaseOrderDispatchStatus.SENT, PurchaseOrderMailSender.idempotencyKey(ok));
        PurchaseOrderDispatch badDispatch = dispatch(PurchaseOrderDispatchStatus.SENT, "po-PLA-BAD-key");

        when(mapper.selectSentButUnmarkedOrderNumbers(org.mockito.ArgumentMatchers.any(), anyInt())).thenReturn(List.of("PLA-BAD", "PLA-OK"));
        when(dispatches.findByOrderNumber("PLA-BAD")).thenReturn(Optional.of(badDispatch));
        when(loader.loadForReconcile("PLA-BAD")).thenThrow(new IllegalStateException("db down"));
        when(dispatches.findByOrderNumber("PLA-OK")).thenReturn(Optional.of(okDispatch));
        when(loader.loadForReconcile("PLA-OK")).thenReturn(ok);
        when(mapper.markSentByOrderNumber("PLA-OK")).thenReturn(1);

        PurchaseOrderDispatchReconciler.Result result = reconciler().reconcile();

        assertEquals(new PurchaseOrderDispatchReconciler.Result(2, 1, 0, 0, 1), result);
        verify(mapper).markSentByOrderNumber(eq("PLA-OK"));
    }

    private PurchaseOrderDispatch dispatch(PurchaseOrderDispatchStatus status, String key) {
        PurchaseOrderDispatch dispatch = mock(PurchaseOrderDispatch.class);
        when(dispatch.getStatus()).thenReturn(status);
        org.mockito.Mockito.lenient().when(dispatch.getIdempotencyKey()).thenReturn(key);
        return dispatch;
    }

    private PurchaseOrderContext context(String orderNumber) {
        Order order = Order.builder()
            .orderNumber(orderNumber)
            .user(user())
            .count(3)
            .recieveDate(LocalDate.of(2099, 1, 1))
            .vendorItem(vendorItem())
            .build();
        return new PurchaseOrderContext(user(), orderNumber, vendor(), "2099.01.01", List.of(order));
    }

    private User user() {
        User user = new User();
        user.setId(1L);
        user.setName("발주 담당자");
        user.setEmail("buyer@test.com");
        user.setUserRank(UserRank.EMPLOYEE);
        user.setUserRole(UserRole.PLACE_ORDER);
        return user;
    }

    private VendorItem vendorItem() {
        VendorItem vendorItem = new VendorItem();
        vendorItem.setVendor(vendor());
        return vendorItem;
    }

    private Vendor vendor() {
        return Vendor.builder()
            .id(1L)
            .vendorName("테스트 공급처")
            .bossName("대표")
            .telephone("010-0000-0000")
            .email("vendor@test.com")
            .build();
    }
}
