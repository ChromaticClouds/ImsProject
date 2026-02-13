package com.example.ims.features.order.controllers;

import com.example.ims.features.order.dto.OrderBootstrap;
import com.example.ims.features.order.dto.PurchaseOrderRequest;
import com.example.ims.features.order.services.PurchaseOrderService;
import com.example.ims.features.product.dto.ProductSummary;
import com.example.ims.features.user.dto.UserPrincipal;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("purchase/order")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderService service;

    @GetMapping("bootstrap")
    public ResponseEntity<ApiResponse<OrderBootstrap>> initBootstrap() {
        return ResponseEntity.ok(ApiResponse.success(service.initBootstrap()));
    }

    @GetMapping("supplier/{id}/product")
    public ResponseEntity<ApiResponse<List<ProductSummary>>> getProductsBySupplier(
        @PathVariable("id") Long supplierId,
        @RequestParam("search") String search
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            service.getProductsBySupplier(supplierId, search)
        ));
    }

    @PostMapping("post")
    public ResponseEntity<ApiResponse<Void>> postPlaceOrder(
        @RequestBody PurchaseOrderRequest request,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        service.postPurchaseOrder(user.userId(), request);
        return ResponseEntity.ok(ApiResponse.success("발주 등록에 성공했습니다."));
    }
}
