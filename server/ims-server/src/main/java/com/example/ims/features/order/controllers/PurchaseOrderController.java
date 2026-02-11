package com.example.ims.features.order.controllers;

import com.example.ims.features.order.dto.OrderBootstrap;
import com.example.ims.features.order.services.PurchaseOrderService;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}
