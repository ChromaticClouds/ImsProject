package com.example.ims.features.inbound.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.inbound.dto.InboundOrderDetail;
import com.example.ims.features.inbound.dto.InboundOrderRow;
import com.example.ims.features.inbound.dto.InboundStatusUpdateResponse;
import com.example.ims.features.inbound.dto.PageResponse;
import com.example.ims.features.inbound.dto.PendingDetailResponse;
import com.example.ims.features.inbound.dto.PendingItemRow;
import com.example.ims.features.inbound.dto.PendingSummaryRow;
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
    
    @PatchMapping("/orders/{orderId}/pending")
    public InboundStatusUpdateResponse markPending(@PathVariable("orderId") Long orderId) {
        return service.markPending(orderId);
    }

    @PatchMapping("/orders/{orderId}/complete")
    public InboundStatusUpdateResponse markComplete(@PathVariable("orderId") Long orderId) {
        return service.markComplete(orderId);
    }
    
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
        int updated = service.markCompleteByOrderNumber(orderNumber);

        return InboundStatusUpdateResponse.builder()
            .orderId(null) // orderNumber 벌크라 특정 id 없음
            .status("INBOUND_COMPLETE")
            .orderDate(LocalDate.now())
            .build();
    }
    
  


   
}
