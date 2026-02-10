package com.example.ims.features.statistics.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.statistics.dto.ClientRankRow;
import com.example.ims.features.statistics.dto.InOutByProductRow;
import com.example.ims.features.statistics.service.StatisticsService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/statistics")
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
      @RequestParam(value = "limit", required = false) Integer limit
  ) {
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
      @RequestParam(value = "limit", required = false) Integer limit
  ) {
    return service.searchProducts(keyword, limit);
  }

  // --------------------------------------------------------------------------
  // 거래처별 입고/출고 순위
  
  @GetMapping("/rank/inbound")
  public List<ClientRankRow> inboundPartnerRank(
	  @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      @RequestParam(value="limit", required=false) Integer limit
  ) {
  return service.getInboundPartnerRank(from, to, limit);
}

@GetMapping("/rank/outbound")
public List<ClientRankRow> outboundPartnerRank(
   @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
   @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
   @RequestParam(value="limit", required=false) Integer limit
) {
 return service.getOutboundPartnerRank(from, to, limit);
}

// -----------------------------------------------------------------------------
// 품목별 수량 그래프



  
  
}














