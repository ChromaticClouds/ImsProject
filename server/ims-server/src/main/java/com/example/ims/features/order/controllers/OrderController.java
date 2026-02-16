package com.example.ims.features.order.controllers;

import com.example.ims.features.order.dto.*;
import com.example.ims.features.order.services.OrderService;
import com.example.ims.features.user.dto.UserIdentifier;
import com.example.ims.features.user.dto.UserPrincipal;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService service;

    @GetMapping("receive")
    public ResponseEntity<ApiResponse<List<OrderSummary>>> getReceiveOrders(
        @RequestParam(required = false, value = "search") String search,
        @RequestParam(required = false, value = "fromDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate fromDate,
        @RequestParam(required = false, value = "toDate")
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
        LocalDate toDate,
        @RequestParam(required = false, value = "salerId") Long salerId
    ) {
        List<OrderSummary> orders =
            service.getReceiveOrders(search, fromDate, toDate, salerId);
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
    public ResponseEntity<ApiResponse<Void>> postOrder(
        @RequestBody OrderPostRequest request,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        service.postOrder(user.userId(), request);
        return ResponseEntity.ok(ApiResponse.success("주문서가 성공적으로 업로드 되었습니다."));
    }

    @GetMapping("get-managers")
    public ResponseEntity<ApiResponse<List<UserIdentifier>>> getOutboundManagers() {
        List<UserIdentifier> managers = service.getOutboundManagers();
        return ResponseEntity.ok(ApiResponse.success(managers));
    }

    @PatchMapping("/{orderNumber}/manager")
    public ResponseEntity<ApiResponse<Void>> patchOutboundManager(
        @PathVariable("orderNumber") String orderNumber,
        @RequestBody AssignOutboundManagerRequest request
    ) {
        service.assignOutboundManager(orderNumber, request.managerId());
        return ResponseEntity.ok(ApiResponse.success("ok"));
    }

    @GetMapping("get-salers")
    public ResponseEntity<ApiResponse<List<VendorIdentifier>>> getSalers() {
        return ResponseEntity.ok(ApiResponse.success(service.getSalers()));
    }

    @GetMapping("{orderNumber}/items")
    public ResponseEntity<ApiResponse<List<OrderDetail>>> getItemsByOrderNumber(
        @PathVariable("orderNumber") String orderNumber
    ) {
        return ResponseEntity.ok(ApiResponse.success(
            service.getItemsByOrderNumber(orderNumber)
        ));
    }
}
