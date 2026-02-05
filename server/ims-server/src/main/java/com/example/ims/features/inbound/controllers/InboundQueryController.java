package com.example.ims.features.inbound.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.example.ims.features.inbound.dto.*;
import com.example.ims.features.inbound.service.InboundQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inbounds")
public class InboundQueryController {

    private final InboundQueryService service;

    @GetMapping("/pending")
    public PageResponse<InboundOrderRow> pending(
        @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return service.getPending(from, to, keyword, page, size);
    }

    @GetMapping("/completed")
    public PageResponse<InboundOrderRow> completed(
        @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(value = "keyword", required = false) String keyword,
        @RequestParam(value = "page", defaultValue = "0") int page,
        @RequestParam(value = "size", defaultValue = "20") int size
    ) {
        return service.getCompleted(from, to, keyword, page, size);
    }

    @GetMapping("/orders/{orderId}")
    public InboundOrderDetail orderDetail(@PathVariable Long orderId) {
        return service.getOrderDetail(orderId);
    }

//    @PatchMapping("/orders/{orderId}/pending")
//    public InboundStatusUpdateResponse markPending(@PathVariable("orderId") Long orderId) {
//        return service.markPending(orderId);
//    }

    @PatchMapping("/orders/{orderId}/complete")
    public InboundStatusUpdateResponse markComplete(@PathVariable("orderId") Long orderId) {
        return service.markComplete(orderId);
    }

    // -------------------------
    // Pending summary/items/detail/update
    // -------------------------
    @GetMapping("/pending/summary")
    public PageResponse<PendingSummaryRow> pendingSummary(
        @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @RequestParam(value="keyword", required=false) String keyword,
        @RequestParam(value="page", defaultValue="0") int page,
        @RequestParam(value="size", defaultValue="20") int size
    ) {
        return service.getPendingSummary(from, to, keyword, page, size);
    }

    @GetMapping("/pending/{orderNumber}/items")
    public List<PendingItemRow> pendingItems(@PathVariable("orderNumber") String orderNumber) {
        return service.getPendingItemsByOrderNumber(orderNumber);
    }

    @GetMapping("/pending/{orderNumber}")
    public PendingDetailResponse pendingDetail(@PathVariable("orderNumber") String orderNumber) {
        return service.getPendingDetailByOrderNumber(orderNumber);
    }

    @PatchMapping("/orders/by-number/{orderNumber}/complete")
    public InboundStatusUpdateResponse markCompleteByOrderNumber(@PathVariable("orderNumber") String orderNumber) {
    	service.markCompleteByOrderNumberAndWriteHistoryAndStock(orderNumber);

        return InboundStatusUpdateResponse.builder()
            .orderId(null)
            .status("INBOUND_COMPLETE")
            .orderDate(LocalDate.now())
            .build();
    }

    @PatchMapping("/pending/{orderNumber}")
    public PendingDetailResponse updatePending(
        @PathVariable("orderNumber") String orderNumber,
        @RequestBody PendingUpdateRequest req
    ) {
        service.updatePendingByOrderNumber(orderNumber, req);
        return service.getPendingDetailByOrderNumber(orderNumber);
    }

    // -------------------------
    // 완료(오늘만) summary + items
    // -------------------------
    @GetMapping("/completed/today/summary")
    public PageResponse<CompletedSummaryRow> completedTodaySummary(
        @RequestParam(value="keyword", required=false) String keyword,
        @RequestParam(value="page", defaultValue="0") int page,
        @RequestParam(value="size", defaultValue="20") int size
    ) {
        return service.getCompletedTodaySummary(keyword, page, size);
    }

    @GetMapping("/completed/{orderNumber}/items")
    public List<CompletedItemRow> completedItems(@PathVariable("orderNumber") String orderNumber) {
        return service.getCompletedItemsByOrderNumber(orderNumber);
    }
}



