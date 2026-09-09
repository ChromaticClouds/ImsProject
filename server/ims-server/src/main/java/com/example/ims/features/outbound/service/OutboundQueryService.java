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
  public void completeByOrderNumberAndWriteHistory(String orderNumber, String memo, Long actorUserId) {
    if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
    String on = orderNumber.trim();
    if (actorUserId == null || actorUserId <= 0) {
      throw new IllegalArgumentException("출고 완료 작업자 인증 정보가 없습니다");
    }

    List<OutboundCompleteOrderRow> orders = mapper.selectOrdersForOutboundComplete(on);
    if (orders == null || orders.isEmpty()) throw new IllegalArgumentException("출고 대기 주문이 없습니다: " + on);

    HistoryLot lot = new HistoryLot();
    lot.setUserId(actorUserId);
    lot.setOrderNumber(on);
    lot.setMemo(StringUtils.hasText(memo) ? memo.trim() : null);

    int lotInserted = mapper.insertHistoryLot(lot);
    if (lotInserted != 1 || lot.getId() == null || lot.getId() <= 0) {
      throw new IllegalStateException("history_lot 생성 실패");
    }
    Long lotId = lot.getId();

    for (OutboundCompleteOrderRow r : orders) {
      if (r == null) throw new IllegalStateException("출고 완료 대상 행이 비어 있습니다. orderNumber=" + on);

      Long productId = r.getProductId();
      Long sellerVendorId = r.getSellerVendorId();
      int qty = r.getOrderQty() == null ? 0 : r.getOrderQty();

      if (productId == null || productId <= 0) {
        throw new IllegalArgumentException("productId가 유효하지 않습니다. orderNumber=" + on);
      }
      if (sellerVendorId == null || sellerVendorId <= 0) {
        throw new IllegalArgumentException("sellerVendorId가 유효하지 않습니다. productId=" + productId);
      }
      if (qty <= 0) {
        throw new IllegalArgumentException("출고 수량은 1 이상이어야 합니다. productId=" + productId);
      }

      Integer before = mapper.selectStockCountForUpdate(productId);
      int beforeCount = before == null ? 0 : before.intValue();
      

      int afterCount = beforeCount - qty;
      if (afterCount < 0) throw new IllegalArgumentException("재고 부족: productId=" + productId);

      
      
      mapper.insertHistoryOutbound(lotId, r.getSellerVendorId(), productId, beforeCount, afterCount);

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
