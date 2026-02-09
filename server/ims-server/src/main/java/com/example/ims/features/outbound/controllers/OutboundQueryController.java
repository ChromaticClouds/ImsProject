package com.example.ims.features.outbound.controllers;

import java.time.LocalDate;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import com.example.ims.features.inbound.dto.HistoryLot;
import com.example.ims.features.inbound.dto.PageResponse;
import com.example.ims.features.outbound.dto.*;
import com.example.ims.features.outbound.service.OutboundQueryService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/outbounds")
public class OutboundQueryController {

  private final OutboundQueryService service;

  //담당자 목록
  @GetMapping("/assignees")
  public List<OutboundAssigneeRow> assignees() {
    return service.getAssignees();
  }

  // userId
  @GetMapping("/pending/summary")
  public PageResponse<OutboundSummaryRow> pendingSummary(
      @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
      @RequestParam("to")   @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
      @RequestParam(value="userId", required=false) Long userId,
      @RequestParam(value="page", defaultValue="0") int page,
      @RequestParam(value="size", defaultValue="20") int size
  ) {
    return service.getPendingSummary(from, to, userId, page, size);
  }

  @GetMapping("/pending/{orderNumber}/items")
  public List<OutboundItemRow> pendingItems(@PathVariable("orderNumber") String orderNumber) {
    return service.getPendingItems(orderNumber);
  }

  @GetMapping("/completed/today/summary")
  public PageResponse<OutboundSummaryRow> completedTodaySummary(
      @RequestParam(value="page", defaultValue="0") int page,
      @RequestParam(value="size", defaultValue="50") int size
  ) {
    return service.getCompletedTodaySummary(page, size);
  }

  @GetMapping("/completed/{orderNumber}/items")
  public List<OutboundItemRow> completedItems(@PathVariable("orderNumber") String orderNumber) {
    return service.getCompletedItems(orderNumber);
  }

  @PatchMapping("/orders/by-number/{orderNumber}/complete")
  public void complete(
      @PathVariable("orderNumber") String orderNumber,
      @RequestBody(required = false) HistoryLot req
  ) {
    service.completeByOrderNumberAndWriteHistory(orderNumber, req == null ? null : req.getMemo());
  }
  
  @GetMapping("/stock/types")
  public DataResponse<List<String>> stockTypes(){
	  return DataResponse.of(service.getStockTypes());
  }
  
  @GetMapping("/stock/brands")
  public DataResponse<List<String>> stockBrands(@RequestParam("type") String type){
	  return DataResponse.of(service.getStockBrandsByType(type));
  }
  
  @GetMapping("/stock/products")
  public DataResponse<List<OutboundStockProductRow>> stockProducts(
		  @RequestParam("type") String type,
		  @RequestParam("brand") String brand		  
		  ){
	  return DataResponse.of(service.getStockProducts(type, brand));
  }
  
  

}



