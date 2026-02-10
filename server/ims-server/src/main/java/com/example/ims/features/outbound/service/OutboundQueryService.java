package com.example.ims.features.outbound.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.ims.features.inbound.dto.HistoryLot;
import com.example.ims.features.inbound.dto.PageResponse;
import com.example.ims.features.outbound.dto.OutboundAssigneeRow;
import com.example.ims.features.outbound.dto.OutboundCompleteOrderRow;
import com.example.ims.features.outbound.dto.OutboundItemRow;
import com.example.ims.features.outbound.dto.OutboundStockProductRow;
import com.example.ims.features.outbound.dto.OutboundSummaryRow;
import com.example.ims.features.outbound.mapper.OutboundQueryMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class OutboundQueryService {

  private final OutboundQueryMapper mapper;

  // 담당자 목록
  public List<OutboundAssigneeRow> getAssignees() {
    return mapper.selectOutboundAssignees();
  }

  // userId 
  public PageResponse<OutboundSummaryRow> getPendingSummary(LocalDate from, LocalDate to, Long userId, int page, int size) {
    int safePage = Math.max(page, 0);
    int safeSize = Math.min(Math.max(size, 1), 100);
    int offset = safePage * safeSize;

    List<OutboundSummaryRow> rows = mapper.selectPendingSummary(from, to, userId, offset, safeSize);
    long total = mapper.countPendingSummary(from, to, userId);

    return PageResponse.of(rows, safePage, safeSize, total);
  }

  public List<OutboundItemRow> getPendingItems(String orderNumber) {
    if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
    return mapper.selectPendingItemsByOrderNumber(orderNumber.trim());
  }

  public PageResponse<OutboundSummaryRow> getCompletedTodaySummary(int page, int size) {
    int safePage = Math.max(page, 0);
    int safeSize = Math.min(Math.max(size, 1), 200);
    int offset = safePage * safeSize;

    List<OutboundSummaryRow> rows = mapper.selectCompletedTodaySummary(offset, safeSize);
    long total = mapper.countCompletedTodaySummary();

    return PageResponse.of(rows, safePage, safeSize, total);
  }

  public List<OutboundItemRow> getCompletedItems(String orderNumber) {
    if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
    return mapper.selectCompletedItemsByOrderNumber(orderNumber.trim());
  }

  @Transactional
  public void completeByOrderNumberAndWriteHistory(String orderNumber, String memo) {
    if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
    String on = orderNumber.trim();

    List<OutboundCompleteOrderRow> orders = mapper.selectOrdersForOutboundComplete(on);
    if (orders == null || orders.isEmpty()) throw new IllegalArgumentException("출고 대기 주문이 없습니다: " + on);

    Long userId = orders.get(0).getUserId();
    if (userId == null) throw new IllegalArgumentException("userId가 없습니다: " + on);

    
    HistoryLot lot = new HistoryLot();
    lot.setUserId(userId);
    lot.setMemo(StringUtils.hasText(memo) ? memo.trim() : null);
    
    mapper.insertHistoryLot(lot);
    
    Long lotId = mapper.selectLastHistoryLotId();
    if (lotId == null || lotId <= 0) throw new IllegalStateException("history_lot id 실패");
    

    for (OutboundCompleteOrderRow r : orders) {
      Long productId = r.getProductId();
      Long sellerVendorId = r.getSellerVendorId();
      int qty = r.getOrderQty() == null ? 0 : r.getOrderQty();

      if (productId == null || productId <= 0) continue;
      if (qty <= 0) continue;

      Integer before = mapper.selectStockCountForUpdate(productId);
      int beforeCount = before == null ? 0 : before.intValue();
      

      int afterCount = beforeCount - qty;
      if (afterCount < 0) throw new IllegalArgumentException("재고 부족: productId=" + productId);

      
      
      mapper.insertHistoryOutbound(lotId, r.getSellerVendorId(), userId, productId, beforeCount, afterCount);

      mapper.upsertStockByDelta(productId, -qty);
    }

    int updated = mapper.markOutboundCompleteByOrderNumber(on);
    if (updated <= 0) throw new IllegalArgumentException("출고 완료 처리 실패: " + on);
  }
  
  
  public List<String> getStockTypes(){
	  return mapper.selectStockTypes();
  }
  
  public List<String> getStockBrandsByType(String type){
	  if(!StringUtils.hasText(type)) throw new IllegalArgumentException("type 있어야 함");
	  return mapper.selectStockBrandsByType(type.trim());
  }
  
  public List<OutboundStockProductRow> getStockProducts(String type, String brand){
	  if(!StringUtils.hasText(type)) throw new IllegalArgumentException("type 있어야 함");
	  if(!StringUtils.hasText(brand)) throw new IllegalArgumentException("brand 있어야 함");
	  return mapper.selectStockProducts(type.trim(), brand.trim());
  }
  
  
  
}
