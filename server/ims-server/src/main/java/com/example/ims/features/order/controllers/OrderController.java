package com.example.ims.features.order.controllers;

import com.example.ims.features.order.dto.OrderResponse;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.services.OrderService;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @GetMapping("receive")
    public ResponseEntity<ApiResponse<List<OrderResponse>>> getReceiveOrders() {
        List<OrderResponse> orders = service.getReceiveOrders()
            .stream()
            .map(OrderResponse::from)
            .toList();

        return ResponseEntity.ok(ApiResponse.success(orders));
    }
}
