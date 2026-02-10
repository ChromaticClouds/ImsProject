//package com.example.ims.features.purchaseorder.controllers;
//
//import com.example.ims.features.purchaseorder.common.ApiResponse;
//import com.example.ims.features.purchaseorder.common.PageResponse;
//import com.example.ims.features.purchaseorder.dto.PurchaseOrderCreateRequest;
//import com.example.ims.features.purchaseorder.dto.PurchaseOrderResponse;
//import com.example.ims.features.purchaseorder.dto.PurchaseOrderSearchCondition;
//import com.example.ims.features.purchaseorder.dto.PurchaseOrderStatusUpdateRequest;
//import com.example.ims.features.purchaseorder.services.PurchaseOrderService;
//
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/api/purchase-orders")
//public class PurchaseOrderController {
//
//    private final PurchaseOrderService service;
//
//    public PurchaseOrderController(PurchaseOrderService service) {
//        this.service = service;
//    }
//
//    /**
//     * 목록 조회 (ky/fetch에서 호출)
//     * 예) GET /api/purchase-orders?status=BEFORE&page=0&size=10
//     */
//    @GetMapping
//    public ApiResponse<PageResponse<PurchaseOrderResponse>> list(
//            @RequestParam(required = false) String status,
//            @RequestParam(defaultValue = "0") int page,
//            @RequestParam(defaultValue = "10") int size
//    ) {
//        PurchaseOrderSearchCondition cond = new PurchaseOrderSearchCondition();
//        cond.setStatus(status);
//        cond.setPage(page);
//        cond.setSize(size);
//
//        return ApiResponse.ok(service.getList(cond));
//    }
//
//    /**
//     * 상세 조회
//     * 예) GET /api/purchase-orders/1
//     */
//    @GetMapping("/{id}")
//    public ApiResponse<PurchaseOrderResponse> detail(@PathVariable Long id) {
//        return ApiResponse.ok(service.getDetail(id));
//    }
//
//    /**
//     * 발주 등록
//     * 예) POST /api/purchase-orders
//     * body: PurchaseOrderCreateRequest(JSON)
//     */
//    @PostMapping
//    public ApiResponse<Long> create(@RequestBody PurchaseOrderCreateRequest req) {
//        Long id = service.create(req);
//        return ApiResponse.ok("등록되었습니다.", id);
//    }

///**
// * 상태 변경(전송완료 처리 등)
// * 예) PATCH /api/purchase-orders/1/status
// * body: { "status": "COMPLETE", "recieveDate": "2026-02-10" }
