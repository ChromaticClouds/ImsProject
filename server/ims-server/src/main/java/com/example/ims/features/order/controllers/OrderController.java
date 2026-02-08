package com.example.ims.features.order.controllers;

import com.example.ims.features.order.dto.*;
import com.example.ims.features.order.services.OrderService;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @GetMapping("receive")
    public ResponseEntity<ApiResponse<List<OrderSummary>>> getReceiveOrders() {
        List<OrderSummary> orders = service.getReceiveOrders();

        return ResponseEntity.ok(ApiResponse.success(orders));
    }

    @GetMapping("bootstrap")
    public ResponseEntity<ApiResponse<OrderBootstrap>> getOrderBootstrap() {
        OrderBootstrap bootstrap = service.getOrderBootstrap();

        return ResponseEntity.ok(ApiResponse.success(bootstrap));
    }

    @GetMapping("get-products")
    public ResponseEntity<ApiResponse<List<OrderProduct>>> getProducts(
        @RequestParam(value = "search", defaultValue = "") String search
    ) {
        List<OrderProduct> products = service.getProducts(search);

        return ResponseEntity.ok(ApiResponse.success(products));
    }

    @PostMapping("post")
    public ResponseEntity<ApiResponse<Void>> postOrder(@RequestBody OrderPostRequest request) {
        service.postOrder(request);

        return ResponseEntity.ok(ApiResponse.success("발주서가 성공적으로 업로드 되었습니다."));
    }
}
