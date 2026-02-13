package com.example.ims.features.purchaseorder.controllers;

import java.time.LocalDate;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.ims.features.purchaseorder.dto.*;
import com.example.ims.features.purchaseorder.services.PurchaseOrderService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/purchase-orders")
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    // 목록 (그룹)
    @GetMapping
    public PurchaseOrderListResponse list(
        @RequestParam(name = "view", required = false) String view,          // DRAFT | SENT
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "from", required = false) LocalDate from,
        @RequestParam(name = "to", required = false) LocalDate to,
        @RequestParam(name = "page", required = false) Integer page,         // 1-base
        @RequestParam(name = "size", required = false) Integer size
    ) {
        return service.list(view, keyword, from, to, page, size);
    }

    // 단건 조회 (수정 페이지 진입)
    @GetMapping("/{orderNumber}")
    public PurchaseOrderGroupRow get(
        @PathVariable(name = "orderNumber") String orderNumber
    ) {
        return service.get(orderNumber);
    }

    // 수정 (납기일 + 라인 count)
    @PatchMapping("/{orderNumber}")
    public ResponseEntity<Void> update(
        @PathVariable(name = "orderNumber") String orderNumber,
        @Valid @RequestBody PurchaseOrderUpdateRequest req
    ) {
        service.update(orderNumber, req);
        return ResponseEntity.ok().build();
    }

    // 삭제 (orderNumber 전체)
    @DeleteMapping("/{orderNumber}")
    public ResponseEntity<Void> delete(
        @PathVariable(name = "orderNumber") String orderNumber
    ) {
        service.delete(orderNumber);
        return ResponseEntity.ok().build();
    }

    // 전송 (단건)
    @PostMapping("/{orderNumber}/send")
    public ResponseEntity<Void> sendOne(
        @PathVariable(name = "orderNumber") String orderNumber
    ) {
        service.sendOne(orderNumber);
        return ResponseEntity.ok().build();
    }

    // 전송 (bulk)
    @PostMapping("/send")
    public ResponseEntity<Void> bulkSend(@Valid @RequestBody OrderNumbersRequest req) {
        service.bulkSend(req.getOrderNumbers());
        return ResponseEntity.ok().build();
    }

    // 삭제 (bulk)
    @PostMapping("/delete")
    public ResponseEntity<Void> bulkDelete(@Valid @RequestBody OrderNumbersRequest req) {
        service.bulkDelete(req.getOrderNumbers());
        return ResponseEntity.ok().build();
    }
}


