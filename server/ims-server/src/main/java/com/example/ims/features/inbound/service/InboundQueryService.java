package com.example.ims.features.inbound.service;

import lombok.RequiredArgsConstructor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.example.ims.features.inbound.dto.*;
import com.example.ims.features.inbound.mapper.InboundQueryMapper;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InboundQueryService {

    private final InboundQueryMapper mapper;

    // -----------------------------------------------------------------------------------------
    // 1) 목록 조회
    public PageResponse<InboundOrderRow> getPending(LocalDate from, LocalDate to, String keyword, int page, int size) {
        validateRange(from, to);
        int safePage = Math.max(page, 0);
        int safeSize = clampSize(size);
        int offset = safePage * safeSize;

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        List<InboundOrderRow> rows = mapper.selectPendingList(from, to, kw, offset, safeSize);
        long total = mapper.countPending(from, to, kw);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    public PageResponse<InboundOrderRow> getCompleted(LocalDate from, LocalDate to, String keyword, int page, int size) {
        validateRange(from, to);
        int safePage = Math.max(page, 0);
        int safeSize = clampSize(size);
        int offset = safePage * safeSize;

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        List<InboundOrderRow> rows = mapper.selectCompletedList(from, to, kw, offset, safeSize);
        long total = mapper.countCompleted(from, to, kw);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    // -----------------------------------------------------------------------------------------
    // 2) 상세/상태
    public InboundOrderDetail getOrderDetail(Long orderId) {
        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("ID 제대로 안 넘어왔음");
        InboundOrderDetail detail = mapper.selectOrderDetail(orderId);
        if (detail == null) throw new IllegalArgumentException("주문 데이터가 없는데? orderId=" + orderId);
        return detail;
    }

    public InboundStatusUpdateResponse markComplete(Long orderId) {
        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("ID 확인 부탁");

        int updated = mapper.markInboundComplete(orderId);
        if (updated != 1) throw new IllegalArgumentException("이미 완료됐거나 없는 ID임: " + orderId);

        InboundStatusUpdateResponse snapshot = mapper.selectStatusSnapshot(orderId);
        if (snapshot == null) throw new IllegalArgumentException("주문 조회 불가: " + orderId);

        return snapshot;
    }

    // -----------------------------------------------------------------------------------------
    // 3) pending summary/items/detail/update
    public PageResponse<InboundSummaryRow> getPendingSummary(LocalDate from, LocalDate to, String keyword, int page, int size) {
        validateRange(from, to);

        int safePage = Math.max(page, 0);
        int safeSize = clampSize(size);
        int offset = safePage * safeSize;

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        InboundSummaryParam param = InboundSummaryParam.builder()
            .from(from).to(to).keyword(kw).offset(offset).size(safeSize)
            .build();

        List<InboundSummaryRow> rows = mapper.selectPendingSummary(param);
        long total = mapper.countPendingSummary(param);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    public List<InboundItemRow> getPendingItemsByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("발주번호가 없으면 조회를 못해요");
        return mapper.selectPendingItemsByOrderNumber(orderNumber.trim());
    }

    public PendingDetailResponse getPendingDetailByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");

        String on = orderNumber.trim();
        PendingDetailResponse header = mapper.selectPendingDetailHeader(on);
        if (header == null) throw new IllegalArgumentException("존재하지 않는 발주번호: " + on);

        header.setItems(mapper.selectPendingItemsByOrderNumber(on));
        return header;
    }

    public void updatePendingByOrderNumber(String orderNumber, PendingUpdateRequest req) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
        String on = orderNumber.trim();
        if (req == null) throw new IllegalArgumentException("수정할 내용이 없어요");

        if (req.getReceiveDate() != null) {
            mapper.updateReceiveDateByOrderNumber(on, req.getReceiveDate());
        }

        if (req.getItems() != null) {
            for (PendingUpdateRequest.Item it : req.getItems()) {
                if (it.getOrderId() == null || it.getOrderId() <= 0) continue;
                Integer qty = it.getOrderQty();
                if (qty == null || qty < 0) throw new IllegalArgumentException("수량에 음수는 좀...");

                int updated = mapper.updateOrderQty(it.getOrderId(), qty);
                if (updated != 1) throw new IllegalArgumentException("수량 수정 꼬임: id=" + it.getOrderId());
            }
        }
    }

    // -----------------------------------------------------------------------------------------
    // 4) completed(today)
    public PageResponse<InboundSummaryRow> getCompletedTodaySummary(String keyword, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = clampSize(size);
        int offset = safePage * safeSize;

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        List<InboundSummaryRow> rows = mapper.selectCompletedTodaySummary(kw, offset, safeSize);
        long total = mapper.countCompletedTodaySummary(kw);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    public List<InboundItemRow> getCompletedItemsByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("번호 주세용");
        return mapper.selectCompletedItemsByOrderNumber(orderNumber.trim());
    }

    // -----------------------------------------------------------------------------------------
    // ✅ 발주번호로 입고완료 + history + stock + memo(history_lot)
    @Transactional
    public int markCompleteByOrderNumberAndWriteHistory(String orderNumber, String memo) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
        String on = orderNumber.trim();

        List<InboundCompleteOrderRow> rows = mapper.selectOrdersForInboundCompleteByOrderNumber(on);
        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException("입고 완료 대상이 없습니다(이미 완료됐거나 발주번호 없음): " + on);
        }

        Long fallbackUserId = rows.get(0).getUserId();
        if (fallbackUserId == null) throw new IllegalArgumentException("userId가 없습니다: " + on);

        // ✅ 1) history_lot 먼저 만들고 lotId 확보
        HistoryLot lot = new HistoryLot();
        lot.setUserId(fallbackUserId);
        lot.setStatus("INBOUND");
        lot.setMemo(StringUtils.hasText(memo) ? memo.trim() : null);

        int lotInserted = mapper.insertHistoryLot(lot);
        if (lotInserted != 1 || lot.getId() == null) {
            throw new IllegalStateException("history_lot 생성 실패");
        }
        Long lotId = lot.getId();

        // ✅ 2) 라인별 history + stock
        for (InboundCompleteOrderRow r : rows) {
            Long vendorItemId = r.getVendorItemId();
            if (vendorItemId == null || vendorItemId <= 0) continue;

            int qty = (r.getOrderQty() == null ? 0 : r.getOrderQty().intValue());
            if (qty <= 0) continue;

            Long productId = mapper.selectProductIdByVendorItemId(vendorItemId);
            if (productId == null || productId <= 0) {
                throw new IllegalArgumentException("productId 없음. vendorItemId=" + vendorItemId);
            }

            Integer latestAfter = mapper.selectLatestAfterCountForUpdate(vendorItemId);
            int beforeCount = (latestAfter == null ? 0 : latestAfter.intValue());
            int afterCount = beforeCount + qty;

            mapper.insertHistoryRow(lotId, vendorItemId, productId, beforeCount, afterCount);
            mapper.upsertStockByProductId(productId, qty);
        }

        // ✅ 3) 주문 상태 완료
        int updated = mapper.markInboundCompleteByOrderNumber(on);
        if (updated <= 0) throw new IllegalArgumentException("입고 완료 처리 실패: " + on);

        return updated;
    }

    // -----------------------------------------------------------------------------------------
    private void validateRange(LocalDate from, LocalDate to) {
        if (from == null || to == null) throw new IllegalArgumentException("날짜 입력 필수임");
        if (from.isAfter(to)) throw new IllegalArgumentException("시작일이 종료일보다 뒤일 수 없음");
        if (from.plusYears(1).isBefore(to)) throw new IllegalArgumentException("데이터 너무 많음. 1년치만 조회하셈");
    }

    private int clampSize(int size) {
        int s = size <= 0 ? 20 : size;
        return Math.min(s, 100);
    }
}



