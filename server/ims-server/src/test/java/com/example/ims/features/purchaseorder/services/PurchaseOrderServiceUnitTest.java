package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.purchaseorder.dto.LoadGroupResult;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderPdfContent;
import com.example.ims.features.purchaseorder.dto.SendGroupResult;
import com.example.ims.features.purchaseorder.enums.PurchaseOrderSendFailStage;
import com.example.ims.features.purchaseorder.exception.BuildPoContextException;
import com.example.ims.features.purchaseorder.exception.PurchaseOrderSendInProgressException;
import com.example.ims.features.purchaseorder.services.PurchaseOrderDispatchService.Claim;
import com.example.ims.features.purchaseorder.mappers.PurchaseOrderMapper;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import com.resend.core.exception.ResendException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;
import org.mockito.InOrder;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.same;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.inOrder;
import static org.mockito.Mockito.lenient;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderServiceUnitTest {

    @Mock PurchaseOrderMapper mapper;
    @Mock PurchaseOrderPdfService pdfService;
    @Mock PurchaseOrderLoader loader;
    @Mock PurchaseOrderMailSender mailSender;
    @Mock OrderRepository orderRepository;
    @Mock PurchaseOrderDispatchService dispatches;

    @BeforeEach
    void claimsByDefault() {
        lenient().when(dispatches.claim(anyString(), anyString())).thenReturn(Claim.ACQUIRED);
    }

    @Test
    @DisplayName("Given 단일 발주번호 When 전송 성공 Then Context, PDF, 메일, 상태 변경이 순서대로 수행된다")
    void sendOne_GivenValidOrderNumber_WhenSendSucceeds_ThenPipelineRunsInOrder() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-001", "vendor@test.com");
        PurchaseOrderPdfContent content = content(ctx);
        byte[] pdf = new byte[] {1, 2, 3};

        when(loader.load("PLA-001")).thenReturn(ctx);
        when(pdfService.buildDto(ctx)).thenReturn(content);
        when(pdfService.generate(content)).thenReturn(pdf);
        when(mapper.markSentByOrderNumber("PLA-001")).thenReturn(1);

        service.sendOne("PLA-001");

        InOrder inOrder = inOrder(loader, pdfService, mailSender, mapper);
        inOrder.verify(loader).load("PLA-001");
        inOrder.verify(pdfService).buildDto(ctx);
        inOrder.verify(pdfService).generate(content);
        inOrder.verify(mailSender).sendPurchaseOrder(eq(ctx), anyString(), same(pdf));
        inOrder.verify(mapper).markSentByOrderNumber("PLA-001");
        inOrder.verifyNoMoreInteractions();
    }

    @Test
    @DisplayName("Given 메일 전송 성공 When 상태 변경 행 수 불일치 Then 실패로 처리한다")
    void sendOne_GivenStatusRowCountMismatch_WhenSend_ThenFails() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-ROW-MISMATCH", "vendor@test.com");
        PurchaseOrderPdfContent content = content(ctx);
        byte[] pdf = new byte[] {1};

        when(loader.load("PLA-ROW-MISMATCH")).thenReturn(ctx);
        when(pdfService.buildDto(ctx)).thenReturn(content);
        when(pdfService.generate(content)).thenReturn(pdf);
        when(mapper.markSentByOrderNumber("PLA-ROW-MISMATCH")).thenReturn(0);

        assertThrows(
            IllegalStateException.class,
            () -> service.sendOne("PLA-ROW-MISMATCH")
        );
    }

    @ParameterizedTest(name = "vendor email missing case [{index}]: ''{0}''")
    @NullAndEmptySource
    @ValueSource(strings = {" ", "\t"})
    @DisplayName("Given 공급처 이메일 누락 When 전송 Then PDF, 메일, 상태 변경을 수행하지 않는다")
    void sendOne_GivenMissingVendorEmail_WhenSend_ThenStopsBeforePdfMailAndStatusUpdate(String vendorEmail) throws Exception {
        PurchaseOrderLoader realLoader = new PurchaseOrderLoader(orderRepository);
        PurchaseOrderService service = serviceWith(realLoader);
        String orderNumber = "PLA-MISSING";

        when(orderRepository.findAllByOrderNumber(orderNumber))
            .thenReturn(List.of(order(orderNumber, vendorEmail)));

        assertThrows(BuildPoContextException.class, () -> service.sendOne(orderNumber));

        verifyNoInteractions(pdfService, mailSender, mapper);
    }

    @Test
    @DisplayName("Given PDF 생성 실패 When 전송 Then 메일과 상태 변경을 수행하지 않는다")
    void sendOne_GivenPdfGenerationFails_WhenSend_ThenStopsBeforeMailAndStatusUpdate() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-002", "vendor@test.com");
        PurchaseOrderPdfContent content = content(ctx);

        when(loader.load("PLA-002")).thenReturn(ctx);
        when(pdfService.buildDto(ctx)).thenReturn(content);
        when(pdfService.generate(content)).thenThrow(new RuntimeException("pdf fail"));

        assertThrows(RuntimeException.class, () -> service.sendOne("PLA-002"));

        InOrder inOrder = inOrder(loader, pdfService);
        inOrder.verify(loader).load("PLA-002");
        inOrder.verify(pdfService).buildDto(ctx);
        inOrder.verify(pdfService).generate(content);
        verifyNoInteractions(mailSender);
        verify(mapper, never()).markSentByOrderNumber(anyString());
    }

    @Test
    @DisplayName("Given 메일 전송 실패 When 전송 Then 상태 변경을 수행하지 않는다")
    void sendOne_GivenMailSendingFails_WhenSend_ThenDoesNotMarkSent() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-003", "vendor@test.com");
        PurchaseOrderPdfContent content = content(ctx);
        byte[] pdf = new byte[] {4, 5, 6};

        when(loader.load("PLA-003")).thenReturn(ctx);
        when(pdfService.buildDto(ctx)).thenReturn(content);
        when(pdfService.generate(content)).thenReturn(pdf);
        doThrow(new ResendException("mail fail"))
            .when(mailSender).sendPurchaseOrder(eq(ctx), anyString(), same(pdf));

        assertThrows(ResendException.class, () -> service.sendOne("PLA-003"));

        InOrder inOrder = inOrder(loader, pdfService, mailSender);
        inOrder.verify(loader).load("PLA-003");
        inOrder.verify(pdfService).buildDto(ctx);
        inOrder.verify(pdfService).generate(content);
        inOrder.verify(mailSender).sendPurchaseOrder(eq(ctx), anyString(), same(pdf));
        verify(mapper, never()).markSentByOrderNumber(anyString());
    }

    @Test
    @DisplayName("Given 일괄 전송 중 일부 실패 When 전송 Then 정상 건 처리를 계속하고 성공 건만 상태 변경한다")
    void bulkSend_GivenMixedOrders_WhenSomeFail_ThenOnlySuccessfulOrdersAreMarkedSent() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        List<String> orderNumbers = List.of(
            "PLA-OK-1",
            "PLA-MISSING",
            "PLA-PDF-FAIL",
            "PLA-MAIL-FAIL",
            "PLA-OK-2"
        );

        PurchaseOrderContext ok1 = context("PLA-OK-1", "ok1@test.com");
        PurchaseOrderContext pdfFail = context("PLA-PDF-FAIL", "pdf@test.com");
        PurchaseOrderContext mailFail = context("PLA-MAIL-FAIL", "mail@test.com");
        PurchaseOrderContext ok2 = context("PLA-OK-2", "ok2@test.com");
        PurchaseOrderPdfContent ok1Content = content(ok1);
        PurchaseOrderPdfContent pdfFailContent = content(pdfFail);
        PurchaseOrderPdfContent mailFailContent = content(mailFail);
        PurchaseOrderPdfContent ok2Content = content(ok2);
        byte[] ok1Pdf = new byte[] {1};
        byte[] mailFailPdf = new byte[] {2};
        byte[] ok2Pdf = new byte[] {3};

        when(loader.loadGroup(orderNumbers))
            .thenReturn(new LoadGroupResult(
                List.of(ok1, pdfFail, mailFail, ok2),
                List.of(new LoadGroupResult.Fail("PLA-MISSING", "공급처 이메일이 없어 전송할 수 없습니다."))
            ));
        when(pdfService.buildDto(ok1)).thenReturn(ok1Content);
        when(pdfService.generate(ok1Content)).thenReturn(ok1Pdf);
        when(pdfService.buildDto(pdfFail)).thenReturn(pdfFailContent);
        when(pdfService.generate(pdfFailContent)).thenThrow(new RuntimeException("pdf fail"));
        when(pdfService.buildDto(mailFail)).thenReturn(mailFailContent);
        when(pdfService.generate(mailFailContent)).thenReturn(mailFailPdf);
        when(pdfService.buildDto(ok2)).thenReturn(ok2Content);
        when(pdfService.generate(ok2Content)).thenReturn(ok2Pdf);
        when(mapper.markSentByOrderNumber("PLA-OK-1")).thenReturn(1);
        when(mapper.markSentByOrderNumber("PLA-OK-2")).thenReturn(1);
        doAnswer(invocation -> {
            PurchaseOrderContext ctx = invocation.getArgument(0);
            if ("PLA-MAIL-FAIL".equals(ctx.orderNumber())) {
                throw new ResendException("mail fail");
            }
            return null;
        }).when(mailSender).sendPurchaseOrder(any(PurchaseOrderContext.class), anyString(), any(byte[].class));

        SendGroupResult result = service.bulkSend(orderNumbers);

        assertEquals(List.of(
            new SendGroupResult.Success("PLA-OK-1"),
            new SendGroupResult.Success("PLA-OK-2")
        ), result.success(), () -> "failed=" + result.failed());
        assertEquals(3, result.failed().size());

        Map<String, SendGroupResult.Fail> failedByOrderNumber = result.failed().stream()
            .collect(Collectors.toMap(SendGroupResult.Fail::orderNumber, fail -> fail));
        assertEquals(PurchaseOrderSendFailStage.LOAD, failedByOrderNumber.get("PLA-MISSING").stage());
        assertEquals(PurchaseOrderSendFailStage.PDF, failedByOrderNumber.get("PLA-PDF-FAIL").stage());
        assertEquals(PurchaseOrderSendFailStage.MAIL, failedByOrderNumber.get("PLA-MAIL-FAIL").stage());

        InOrder inOrder = inOrder(pdfService, mailSender, mapper);
        inOrder.verify(pdfService).buildDto(ok1);
        inOrder.verify(pdfService).generate(ok1Content);
        inOrder.verify(mailSender).sendPurchaseOrder(eq(ok1), anyString(), same(ok1Pdf));
        inOrder.verify(mapper).markSentByOrderNumber("PLA-OK-1");
        inOrder.verify(pdfService).buildDto(pdfFail);
        inOrder.verify(pdfService).generate(pdfFailContent);
        inOrder.verify(pdfService).buildDto(mailFail);
        inOrder.verify(pdfService).generate(mailFailContent);
        inOrder.verify(mailSender).sendPurchaseOrder(eq(mailFail), anyString(), same(mailFailPdf));
        inOrder.verify(pdfService).buildDto(ok2);
        inOrder.verify(pdfService).generate(ok2Content);
        inOrder.verify(mailSender).sendPurchaseOrder(eq(ok2), anyString(), same(ok2Pdf));
        inOrder.verify(mapper).markSentByOrderNumber("PLA-OK-2");

        verify(mapper, never()).markSentByOrderNumber("PLA-MISSING");
        verify(mapper, never()).markSentByOrderNumber("PLA-PDF-FAIL");
        verify(mapper, never()).markSentByOrderNumber("PLA-MAIL-FAIL");
    }

    @Test
    @DisplayName("Given 다른 요청이 전송 중 When 단건 전송 Then PDF·메일·상태 변경을 하지 않고 거부한다")
    void sendOne_GivenSendInProgress_WhenSend_ThenRejectsWithoutSending() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-BUSY", "vendor@test.com");

        when(loader.load("PLA-BUSY")).thenReturn(ctx);
        when(dispatches.claim(eq("PLA-BUSY"), anyString())).thenReturn(Claim.IN_PROGRESS);

        assertThrows(PurchaseOrderSendInProgressException.class, () -> service.sendOne("PLA-BUSY"));

        verifyNoInteractions(pdfService, mailSender);
        verify(mapper, never()).markSentByOrderNumber(anyString());
    }

    @Test
    @DisplayName("Given 메일은 이미 나갔고 주문 상태만 미반영 When 단건 전송 Then 메일 없이 주문 상태만 맞춘다")
    void sendOne_GivenAlreadyDispatched_WhenSend_ThenOnlyMarksOrders() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-DONE", "vendor@test.com");

        when(loader.load("PLA-DONE")).thenReturn(ctx);
        when(dispatches.claim(eq("PLA-DONE"), anyString())).thenReturn(Claim.ALREADY_SENT);
        when(mapper.markSentByOrderNumber("PLA-DONE")).thenReturn(1);

        service.sendOne("PLA-DONE");

        verifyNoInteractions(pdfService, mailSender);
        verify(mapper).markSentByOrderNumber("PLA-DONE");
    }

    @Test
    @DisplayName("Given 메일 전송 실패 When 단건 전송 Then 발송 이력을 FAILED로 남기고 오류를 그대로 던진다")
    void sendOne_GivenMailFailure_WhenSend_ThenRecordsFailureAndRethrows() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-FAIL", "vendor@test.com");
        PurchaseOrderPdfContent content = content(ctx);

        when(loader.load("PLA-FAIL")).thenReturn(ctx);
        when(pdfService.buildDto(ctx)).thenReturn(content);
        when(pdfService.generate(content)).thenReturn(new byte[] {1});
        doThrow(new ResendException("mail down"))
            .when(mailSender).sendPurchaseOrder(eq(ctx), anyString(), any());

        assertThrows(ResendException.class, () -> service.sendOne("PLA-FAIL"));

        verify(dispatches).markFailed("PLA-FAIL", "mail down");
        verify(dispatches, never()).markSent(anyString());
        verify(mapper, never()).markSentByOrderNumber(anyString());
    }

    @Test
    @DisplayName("Given 전송 성공 When 단건 전송 Then 메일 뒤 이력을 SENT로 바꾸고 그다음 주문 상태를 바꾼다")
    void sendOne_GivenSuccess_WhenSend_ThenMarksDispatchBeforeOrders() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-ORDER", "vendor@test.com");
        PurchaseOrderPdfContent content = content(ctx);

        when(loader.load("PLA-ORDER")).thenReturn(ctx);
        when(pdfService.buildDto(ctx)).thenReturn(content);
        when(pdfService.generate(content)).thenReturn(new byte[] {1});
        when(mapper.markSentByOrderNumber("PLA-ORDER")).thenReturn(1);

        service.sendOne("PLA-ORDER");

        InOrder inOrder = inOrder(mailSender, dispatches, mapper);
        inOrder.verify(mailSender).sendPurchaseOrder(eq(ctx), anyString(), any());
        inOrder.verify(dispatches).markSent("PLA-ORDER");
        inOrder.verify(mapper).markSentByOrderNumber("PLA-ORDER");
    }

    @Test
    @DisplayName("Given 일괄 전송 중 한 건이 전송 중 When 전송 Then 그 건만 LOAD 실패로 보고하고 나머지는 계속 보낸다")
    void bulkSend_GivenOneInProgress_WhenSend_ThenOthersStillSent() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext busy = context("PLA-BUSY", "vendor@test.com");
        PurchaseOrderContext ok = context("PLA-OK", "vendor@test.com");
        PurchaseOrderPdfContent okContent = content(ok);

        when(loader.loadGroup(List.of("PLA-BUSY", "PLA-OK")))
            .thenReturn(new LoadGroupResult(List.of(busy, ok), List.of()));
        when(dispatches.claim(eq("PLA-BUSY"), anyString())).thenReturn(Claim.IN_PROGRESS);
        when(pdfService.buildDto(ok)).thenReturn(okContent);
        when(pdfService.generate(okContent)).thenReturn(new byte[] {1});
        when(mapper.markSentByOrderNumber("PLA-OK")).thenReturn(1);

        SendGroupResult result = service.bulkSend(List.of("PLA-BUSY", "PLA-OK"));

        assertEquals(List.of("PLA-OK"), result.success().stream().map(SendGroupResult.Success::orderNumber).toList());
        assertEquals(1, result.failed().size());
        assertEquals("PLA-BUSY", result.failed().getFirst().orderNumber());
        assertEquals(PurchaseOrderSendFailStage.LOAD, result.failed().getFirst().stage());
        verify(pdfService, never()).buildDto(busy);
    }

    @Test
    @DisplayName("Given 일괄 전송 중 메일 실패 When 전송 Then 그 건의 발송 이력을 FAILED로 남긴다")
    void bulkSend_GivenMailFailure_WhenSend_ThenRecordsFailure() throws Exception {
        PurchaseOrderService service = serviceWith(loader);
        PurchaseOrderContext ctx = context("PLA-MAIL", "vendor@test.com");
        PurchaseOrderPdfContent content = content(ctx);

        when(loader.loadGroup(List.of("PLA-MAIL"))).thenReturn(new LoadGroupResult(List.of(ctx), List.of()));
        when(pdfService.buildDto(ctx)).thenReturn(content);
        when(pdfService.generate(content)).thenReturn(new byte[] {1});
        doThrow(new ResendException("mail down"))
            .when(mailSender).sendPurchaseOrder(eq(ctx), anyString(), any());

        SendGroupResult result = service.bulkSend(List.of("PLA-MAIL"));

        assertEquals(PurchaseOrderSendFailStage.MAIL, result.failed().getFirst().stage());
        verify(dispatches).markFailed("PLA-MAIL", "mail down");
        verify(dispatches, never()).markSent(anyString());
    }

    private PurchaseOrderService serviceWith(PurchaseOrderLoader purchaseOrderLoader) {
        return new PurchaseOrderService(mapper, pdfService, purchaseOrderLoader, mailSender, dispatches);
    }

    private PurchaseOrderContext context(String orderNumber, String vendorEmail) {
        return new PurchaseOrderContext(user(), orderNumber, vendor(vendorEmail), "2099.01.01", List.of(order(orderNumber, vendorEmail)));
    }

    private PurchaseOrderPdfContent content(PurchaseOrderContext ctx) {
        return new PurchaseOrderPdfContent(
            ctx.user().getName(),
            ctx.user().getEmail(),
            ctx.user().getUserRank().getLabel(),
            ctx.receiveDate(),
            ctx.orderNumber(),
            ctx.vendor(),
            List.of(),
            0
        );
    }

    private Order order(String orderNumber, String vendorEmail) {
        return Order.builder()
            .orderNumber(orderNumber)
            .user(user())
            .recieveDate(LocalDate.now().plusDays(1))
            .vendorItem(vendorItem(vendorEmail))
            .build();
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

    private VendorItem vendorItem(String vendorEmail) {
        VendorItem vendorItem = new VendorItem();
        vendorItem.setVendor(vendor(vendorEmail));
        return vendorItem;
    }

    private Vendor vendor(String email) {
        return Vendor.builder()
            .id(1L)
            .vendorName("테스트 공급처")
            .bossName("대표")
            .telephone("010-0000-0000")
            .email(email)
            .build();
    }
}
