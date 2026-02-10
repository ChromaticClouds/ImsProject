package com.example.ims.features.statistics.controllers;

import com.example.ims.features.statistics.dto.LeadTimeResponse;
import com.example.ims.features.statistics.dto.ProductShareResponse;
import com.example.ims.features.statistics.dto.WarehouseShareResponse;
import com.example.ims.features.statistics.services.StatisticsService;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService service;

    @GetMapping("by-warehouse")
    public ResponseEntity<ApiResponse<WarehouseShareResponse>> getWarehouseShare() {
        return ResponseEntity.ok(ApiResponse.success(service.getWarehouseShare()));
    }

    @GetMapping("by-product")
    public ResponseEntity<ApiResponse<List<ProductShareResponse>>> getProductShare() {
        return ResponseEntity.ok(ApiResponse.success(service.getProductShare()));
    }

    @GetMapping("lead-time")
    public ResponseEntity<ApiResponse<List<LeadTimeResponse>>> getLeadTime() {
        return ResponseEntity.ok(ApiResponse.success(service.getLeadTime()));
    }
}
