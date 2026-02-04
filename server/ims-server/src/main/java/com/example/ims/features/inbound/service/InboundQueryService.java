package com.example.ims.features.inbound.service;


import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.example.ims.features.inbound.dto.InboundOrderDetail;
import com.example.ims.features.inbound.dto.InboundOrderRow;
import com.example.ims.features.inbound.dto.InboundPendingSummaryParam;
import com.example.ims.features.inbound.dto.InboundStatusUpdateResponse;
import com.example.ims.features.inbound.dto.PageResponse;
import com.example.ims.features.inbound.dto.PendingDetailResponse;
import com.example.ims.features.inbound.dto.PendingItemRow;
import com.example.ims.features.inbound.dto.PendingSummaryRow;
import com.example.ims.features.inbound.mapper.InboundQueryMapper;


import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InboundQueryService {

    private final InboundQueryMapper mapper;

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

    public InboundOrderDetail getOrderDetail(Long orderId) {
        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("orderId가 올바르지 않습니다.");
        InboundOrderDetail detail = mapper.selectOrderDetail(orderId);
        if (detail == null) throw new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId);
        return detail;
    }

    private void validateRange(LocalDate from, LocalDate to) {
        if (from == null || to == null) throw new IllegalArgumentException("from/to는 필수입니다.");
        if (from.isAfter(to)) throw new IllegalArgumentException("from은 to보다 클 수 없습니다.");
        if (from.plusYears(1).isBefore(to)) throw new IllegalArgumentException("기간은 최대 1년까지 가능합니다.");
    }

    private int clampSize(int size) {
        int s = size <= 0 ? 20 : size;
        return Math.min(s, 100);
    }
    
    public InboundStatusUpdateResponse markPending(Long orderId) {
        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("orderId가 올바르지 않습니다.");

        int updated = mapper.markInboundPending(orderId);
        if (updated != 1) throw new IllegalArgumentException("입고 대기 처리 실패: orderId=" + orderId);

        InboundStatusUpdateResponse snapshot = mapper.selectStatusSnapshot(orderId);
        if (snapshot == null) throw new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId);

        return snapshot;
    }

    public InboundStatusUpdateResponse markComplete(Long orderId) {
        if (orderId == null || orderId <= 0) throw new IllegalArgumentException("orderId가 올바르지 않습니다.");

        int updated = mapper.markInboundComplete(orderId);
        if (updated != 1) throw new IllegalArgumentException("입고 완료 처리 실패(상태 확인 필요): orderId=" + orderId);

        InboundStatusUpdateResponse snapshot = mapper.selectStatusSnapshot(orderId);
        if (snapshot == null) throw new IllegalArgumentException("주문을 찾을 수 없습니다. orderId=" + orderId);

        return snapshot;
    }
    
    public PageResponse<PendingSummaryRow> getPendingSummary(LocalDate from, LocalDate to, String keyword, int page, int size) {
        validateRange(from, to);

        int safePage = Math.max(page, 0);
        int safeSize = clampSize(size);
        int offset = safePage * safeSize;

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;

        InboundPendingSummaryParam param = InboundPendingSummaryParam.builder()
                .from(from)
                .to(to)
                .keyword(kw)
                .offset(offset)
                .size(safeSize)
                .build();

        List<PendingSummaryRow> rows = mapper.selectPendingSummary(param);
        long total = mapper.countPendingSummary(param);

        return PageResponse.of(rows, safePage, safeSize, total);
    }

    public List<PendingItemRow> getPendingItemsByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber은 필수입니다.");
        return mapper.selectPendingItemsByOrderNumber(orderNumber.trim());
    }

    public PendingDetailResponse getPendingDetailByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber은 필수입니다.");

        String on = orderNumber.trim();

        PendingDetailResponse header = mapper.selectPendingDetailHeader(on);
        if (header == null) throw new IllegalArgumentException("해당 발주번호를 찾을 수 없습니다: " + on);

        header.setItems(mapper.selectPendingItemsByOrderNumber(on));
        return header;
    }
    // 입고 완료 처리 상태 확인을 위해서임
    public int markCompleteByOrderNumber(String orderNumber) {
        if (!StringUtils.hasText(orderNumber)) throw new IllegalArgumentException("orderNumber 필수");

        String on = orderNumber.trim();
        int updated = mapper.markInboundCompleteByOrderNumber(on);

        if (updated <= 0) {
            throw new IllegalArgumentException("입고 완료 처리 실패: orderNumber=" + on);
        }

        return updated; 
    }
   
    



}

