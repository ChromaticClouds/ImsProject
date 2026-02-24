package com.example.ims.features.statistics.controllers;

import java.time.LocalDate;

import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.RequestParam;

import com.example.ims.features.inbound.dto.InboundSafeStockRow;
import com.example.ims.features.statistics.dto.ClientRankRow;
import com.example.ims.features.statistics.dto.InOutByProductRow;

import com.example.ims.features.statistics.dto.LeadTimeResponse;
import com.example.ims.features.statistics.dto.ProductShareResponse;
import com.example.ims.features.statistics.dto.StockRotationPoint;
import com.example.ims.features.statistics.dto.WarehouseShareResponse;
import com.example.ims.features.statistics.services.StatisticsService;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
public class StatisticsController {

    private final StatisticsService service;

    // 입출고 수량 합계 (품목별)
    @GetMapping("/in-out/by-product")
    public List<InOutByProductRow> inOutByProduct(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(value = "keyword", required = false) String keyword,
            @RequestParam(value = "type", required = false) String type,
            @RequestParam(value = "brand", required = false) String brand,
            @RequestParam(value = "limit", required = false) Integer limit) {
        return service.getInOutByProduct(from, to, keyword, type, brand, limit);
    }

    // 주종 필터
    @GetMapping("/types")
    public List<String> types() {
        return service.getTypes();
    }

    // 브랜드 필터
    @GetMapping("/brands")
    public List<String> brands(@RequestParam("type") String type) {
        return service.getBrandsByType(type);
    }

    // 검색
    @GetMapping("/products/search")
    public List<InOutByProductRow> searchProducts(
            @RequestParam("keyword") String keyword,
            @RequestParam(value = "limit", required = false) Integer limit) {
        return service.searchProducts(keyword, limit);
    }

    // --------------------------------------------------------------------------
    // 거래처별 입고/출고 순위

    @GetMapping("/rank/inbound")
    public List<ClientRankRow> inboundPartnerRank(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(value = "limit", required = false) Integer limit) {
        return service.getInboundPartnerRank(from, to, limit);
    }

    @GetMapping("/rank/outbound")
    public List<ClientRankRow> outboundPartnerRank(
            @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
            @RequestParam(value = "limit", required = false) Integer limit) {
        return service.getOutboundPartnerRank(from, to, limit);
    }

    // -----------------------------------------------------------------------------
    // 품목별 수량 그래프
    
    @GetMapping("/stock/by-product")
    public List<InboundSafeStockRow> stockByProduct(
        @RequestParam(value="type", required=false) String type,
        @RequestParam(value="unsafeOnly", required=false, defaultValue="false") boolean unsafeOnly,
        @RequestParam(value="limit", required=false) Integer limit
    ) {
      return service.getStockByProduct(type, unsafeOnly, limit);
    }
    
    // -----------------------------------------------------------------------------
    // 재고 회전율
    
    @GetMapping("/stock-rotation/trend")
    public List<StockRotationPoint> stockRotationTrend(
        @RequestParam("year") int year,
        @RequestParam(value="month", required=false) Integer month,
        @RequestParam("productId") Long productId
    ) {
        return service.getStockRotationTrend(year, month, productId);
    }
    
    @GetMapping("/stock-rotation/products/search")
    public List<StockRotationPoint> searchrotationProducts(
        @RequestParam("keyword") String keyword,
        @RequestParam(value="limit", required=false) Integer limit
    ) {
      return service.searchrotationProducts(keyword, limit);
    }
    // -----------------------------------------------------------------------------

    @GetMapping("by-warehouse")
    public ResponseEntity<ApiResponse<WarehouseShareResponse>> getWarehouseShare() {
        return ResponseEntity.ok(ApiResponse.success(service.getWarehouseShare()));
    }

    @GetMapping("by-product")
    public ResponseEntity<ApiResponse<List<ProductShareResponse>>> getProductShare() {
        return ResponseEntity.ok(ApiResponse.success(service.getProductShare()));
    }

    @GetMapping("lead-time/by-vendor")
    public ResponseEntity<ApiResponse<List<LeadTimeResponse>>> getVendorLeadTime(
        @RequestParam("startDate") LocalDate startDate,
        @RequestParam("endDate") LocalDate endDate
    ) {
        List<LeadTimeResponse> vendorLeadTime
            = service.getVendorLeadTime(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(vendorLeadTime));
    }

    @GetMapping("lead-time/by-product")
    public ResponseEntity<ApiResponse<List<LeadTimeResponse>>> getProductLeadTime(
        @RequestParam("startDate") LocalDate startDate,
        @RequestParam("endDate") LocalDate endDate
    ) {
        List<LeadTimeResponse> productLeadTime
            = service.getProductLeadTime(startDate, endDate);
        return ResponseEntity.ok(ApiResponse.success(productLeadTime));
    }
}
