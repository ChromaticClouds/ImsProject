package com.example.ims.features.history.controllers;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.example.ims.features.inbound.dto.PageResponse;
import com.example.ims.features.history.dto.*;
import com.example.ims.features.history.service.HistoryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/history")
public class HistoryController {

  private final HistoryService service;

  // 거래 일순 목록
  @GetMapping("/lots")
  public PageResponse<HistoryLotSummaryRow> lots(
      @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,

      @RequestParam(value="q", required=false) String q,
      @RequestParam(value="kind", required=false) String kind,
      @RequestParam(value="targetId", required=false) Long targetId,

      @RequestParam(value="status", required=false) String status, // INBOUND/OUTBOUND/ADJUST
      @RequestParam(value="type", required=false) String type,
      @RequestParam(value="brand", required=false) String brand,

      @RequestParam(value="page", defaultValue="0") int page,
      @RequestParam(value="size", defaultValue="50") int size
  ) {
    return service.getLots(from, to, q, kind, targetId, status, type, brand, page, size);
  }

  
  // 검색 드롭다운
  @GetMapping("/search")
  public List<HistorySearchSuggestionRow> search(@RequestParam("q") String q) {
    return service.searchSuggestions(q);
  }

  // 브랜드, 주종 확인용
  @GetMapping("/brands")
  public List<String> brands(@RequestParam("type") String type) {
    return service.getBrandsByType(type);
  }
  
  @GetMapping("/min-date")
  public Map<String, String> minDate() {
    String min = service.getMinCreatedDateYmd();
    if (min == null || min.isBlank()) {
      min = LocalDate.now().toString();
    }
    return Map.of("minDate", min);
  }
}
