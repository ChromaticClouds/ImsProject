package com.example.ims.features.inbound.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import com.example.ims.features.inbound.dto.*;
import com.example.ims.features.inbound.mapper.InboundQueryMapper;
import java.time.LocalDate;
import java.util.List;

/**
 */
@Service
@RequiredArgsConstructor
public class InboundQueryService {

    private final InboundQueryMapper mapper;

    // -----------------------------------------------------------------------------------------
    // 1. 목록 조회 (입고 대기 / 완료)

    /**
     * '입고 대기' 리스트 메서드
     */
    public PageResponse<InboundOrderRow> getPending(LocalDate from, LocalDate to, String keyword, int page, int size) {
        validateRange(from, to); // 날짜 이상하게 넣었는지 검사
        int safePage = Math.max(page, 0); // 페이지 0 밑으로 내려가면 안됨
        int safeSize = clampSize(size);  // 한 번에 최대 100개까지만
        int offset = safePage * safeSize; // 개수 계산

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        List<InboundOrderRow> rows = mapper.selectPendingList(from, to, kw, offset, safeSize);
        long total = mapper.countPending(from, to, kw);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    /**
     * '입고 완료' 리스트
     */
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
    // 2. 상태 변경 ID

    /**
     * 주문 하나 클릭해서 상세 정보 볼 때 사용 / id 없으면 예외 처리
     */
    public InboundOrderDetail getOrderDetail(Long orderId) {
        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("ID 제대로 안 넘어왔음");
        InboundOrderDetail detail = mapper.selectOrderDetail(orderId);
        if (detail == null) throw new IllegalArgumentException("주문 데이터가 없는데? orderId=" + orderId);
        return detail;
    }

//    /**
//     * 완료된걸 다시 대기 상태로 돌리고 싶을 때 (실행 후 결과 스냅샷 찍어서 반환)
//     */
//    public InboundStatusUpdateResponse markPending(Long orderId) {
//        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("orderId 체크 요망");
//
//        int updated = mapper.markInboundPending(orderId);
//        if (updated != 1) throw new IllegalArgumentException("상태 변경 실패... 누가 먼저 건드렸나? id=" + orderId);
//
//        InboundStatusUpdateResponse snapshot = mapper.selectStatusSnapshot(orderId);
//        if (snapshot == null) throw new IllegalArgumentException("스냅샷 못 찍음. id=" + orderId);
//
//        return snapshot;
//    }

    /**
     * '입고 완료' 변경
     */
    public InboundStatusUpdateResponse markComplete(Long orderId) {
        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("ID 확인 부탁");

        int updated = mapper.markInboundComplete(orderId);
        if (updated != 1) throw new IllegalArgumentException("이미 완료됐거나 없는 ID임: " + orderId);

        InboundStatusUpdateResponse snapshot = mapper.selectStatusSnapshot(orderId);
        if (snapshot == null) throw new IllegalArgumentException("주문 조회 불가: " + orderId);

        return snapshot;
    }

    // -----------------------------------------------------------------------------------------
    // 3. 발주 번호

    /**
     * 입고 대기 화면 상단 요약 정보
     */
    public PageResponse<PendingSummaryRow> getPendingSummary(LocalDate from, LocalDate to, String keyword, int page, int size) {
        validateRange(from, to);

        int safePage = Math.max(page, 0);
        int safeSize = clampSize(size);
        int offset = safePage * safeSize;

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        // 파라미터 너무 많아서 빌더로 묶음 처리
        InboundPendingSummaryParam param = InboundPendingSummaryParam.builder()
            .from(from).to(to).keyword(kw).offset(offset).size(safeSize)
            .build();

        List<PendingSummaryRow> rows = mapper.selectPendingSummary(param);
        long total = mapper.countPendingSummary(param);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    /**
     * 발주 번호 하나에 딸린 여러 품목 리스트 
     */
    public List<PendingItemRow> getPendingItemsByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("발주번호가 없으면 조회를 못해요");
        return mapper.selectPendingItemsByOrderNumber(orderNumber.trim());
    }

    /**
     * 발주 상세 페이지용 데이터
     */
    public PendingDetailResponse getPendingDetailByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");

        String on = orderNumber.trim();
        PendingDetailResponse header = mapper.selectPendingDetailHeader(on);
        if (header == null) throw new IllegalArgumentException("존재하지 않는 발주번호: " + on);

        // 헤더에 품목 리스트 꽂아주기
        header.setItems(mapper.selectPendingItemsByOrderNumber(on));
        return header;
    }

    /**
     *
     * 발주 번호로 입고 완료 때리면서, 히스토리까지 한 번에 저장함.
     */
    @Transactional
    public int markCompleteByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("발주번호 주셔야죠");
        String on = orderNumber.trim();

        // 1. 일단 이 발주번호에 어떤 품목들 있는지 싹 긁어옴
        List<InboundCompleteOrderRow> rows = mapper.selectOrdersForInboundCompleteByOrderNumber(on);
        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException("완료 처리할 품목이 하나도 없는데? " + on);
        }
        
        // 2. 품목별로 재고가 어떻게 변하는지 계산 -> 히스토리 테이블에 insert
        for (InboundCompleteOrderRow r : rows) {
            Long vendorItemId = r.getVendorItemId();
            Integer qty = r.getOrderQty();
            if (vendorItemId == null || qty == null || qty <= 0) continue;

            // 해당 품목의 가장 최신 '변경 후 수량'을 가져옴
            Integer lastAfter = mapper.selectLatestAfterCountForUpdate(vendorItemId);
            int before = (lastAfter == null) ? 0 : lastAfter;
            int after = before + qty;

            // history 저장 
            int inserted = mapper.insertHistoryRow("INBOUND", r.getUserId(), vendorItemId, before, after);

            if (inserted != 1) {
                throw new IllegalStateException("재고 이력 저장하다 터짐: vendorItemId=" + vendorItemId);
            }
        }

        // 3. order status -->  'INBOUND_PENDING'로 업데이트
        int updated = mapper.markInboundCompleteByOrderNumber(on);
        if (updated <= 0) {
            throw new IllegalArgumentException("오더 상태 변경 실패: " + on);
        }

        return updated;
    }

    /**
     * 입고 대기 중인 발주 정보 수정
     */
    public void updatePendingByOrderNumber(String orderNumber, PendingUpdateRequest req) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
        String on = orderNumber.trim();
        if (req == null) throw new IllegalArgumentException("수정할 내용이 없어요");

        // 날짜 수정 반영
        if (req.getReceiveDate() != null) {
            mapper.updateReceiveDateByOrderNumber(on, req.getReceiveDate());
        }

        // 품목 수량들 하나씩 루프 돌면서 수정
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

    /**
     * 금일 입고 완료 요약
     */
    public PageResponse<CompletedSummaryRow> getCompletedTodaySummary(String keyword, int page, int size) {
        int safePage = Math.max(page, 0);
        int safeSize = clampSize(size);
        int offset = safePage * safeSize;

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        List<CompletedSummaryRow> rows = mapper.selectCompletedTodaySummary(kw, offset, safeSize);
        long total = mapper.countCompletedTodaySummary(kw);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    /**
     * 금일 ㅎㅐ당 발주번호의 품목 리스트 확인
     */
    public List<CompletedItemRow> getCompletedItemsByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("번호 주세용");
        return mapper.selectCompletedItemsByOrderNumber(orderNumber.trim());
    }

    // -----------------------------------------------------------------------------------------
    // 4. 제한 두는 것
   
    // 1년 제한
    private void validateRange(LocalDate from, LocalDate to) {
        if (from == null || to == null) throw new IllegalArgumentException("날짜 입력 필수임");
        if (from.isAfter(to)) throw new IllegalArgumentException("시작일이 종료일보다 뒤일 수 없음");
        if (from.plusYears(1).isBefore(to)) throw new IllegalArgumentException("데이터 너무 많음. 1년치만 조회하셈");
    }

    // 페이지 사이즈 
    private int clampSize(int size) {
        int s = size <= 0 ? 20 : size;
        return Math.min(s, 100);
    }

    /**
     *히스터리 + stock
     */
    @Transactional
    public int markCompleteByOrderNumberAndWriteHistoryAndStock(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");
        String on = orderNumber.trim();

        // 1) 완료 대상 주문 rows
        List<InboundCompleteOrderRow> rows = mapper.selectOrdersForInboundCompleteByOrderNumber(on);
        if (rows == null || rows.isEmpty()) {
            throw new IllegalArgumentException("입고 완료 대상이 없습니다(이미 완료됐거나 발주번호 없음): " + on);
        }

        // 2) 각 row마다 history 기록 + stock 누적
        for (InboundCompleteOrderRow r : rows) {
            Long userId = r.getUserId();
            Long vendorItemId = r.getVendorItemId();
            int qty = r.getOrderQty() == null ? 0 : r.getOrderQty();

            if (vendorItemId == null || vendorItemId <= 0) continue;
            if (qty <= 0) continue;

            // vendor_item_id 최신 after_count (없으면 0)
            Integer latestAfter = mapper.selectLatestAfterCountForUpdate(vendorItemId);
            int before = (latestAfter == null ? 0 : latestAfter);
            int after = before + qty;

            // history insert INBOUND일때만
            mapper.insertHistoryRow("INBOUND", userId, vendorItemId, before, after);

            // vendor_item_id -> product_id
            Long productId = mapper.selectProductIdByVendorItemId(vendorItemId);
            if (productId == null || productId <= 0) {
                throw new IllegalArgumentException("productId를 찾을 수 없습니다. vendorItemId=" + vendorItemId);
            }

            // (d) delta(=after-before) 를 stock에 누적
            int delta = after - before; // = qty
            // status가 INBOUND일 때만 누적(이번 메서드는 입고완료 전용이므로 그대로 적용)
            mapper.upsertStockByProductId(productId, delta);
        }

        // 3) 주문 상태 완료 처리 (order_number 전체)
        int updated = mapper.markInboundCompleteByOrderNumber(on);
        if (updated <= 0) throw new IllegalArgumentException("입고 완료 처리 실패: " + on);

        return updated;
    }
}


