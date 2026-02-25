package com.example.ims.features.statistics.services;

import com.example.ims.features.inbound.dto.InboundSafeStockRow;

import com.example.ims.features.statistics.dto.ClientRankRow;
import com.example.ims.features.statistics.dto.InOutByProductRow;
import com.example.ims.features.statistics.dto.LeadTimeResponse;
import com.example.ims.features.statistics.dto.ProductShareResponse;
import com.example.ims.features.statistics.dto.StockRotationPoint;
import com.example.ims.features.statistics.dto.WarehouseShareResponse;
import com.example.ims.features.statistics.mappers.StatisticsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StatisticsService {

    private static final long WAREHOUSE_VOLUME_ML = 80_000_000L;

    private final StatisticsMapper mapper;

    public WarehouseShareResponse getWarehouseShare() {
        Long usedVolume = mapper.sumUsedVolume();
        Long totalVolume = WAREHOUSE_VOLUME_ML;
        return new WarehouseShareResponse(usedVolume, totalVolume);
    }

    public List<ProductShareResponse> getProductShare() {
        return mapper.findTop5ByUsedVolume();
    }

    public List<LeadTimeResponse> getVendorLeadTime(
        LocalDate startDate, LocalDate endDate
    ) {
        return mapper.findLeadTimeByVendor(startDate, endDate);
    }

    public List<LeadTimeResponse> getProductLeadTime(
        LocalDate startDate, LocalDate endDate
    ) {
        return mapper.findLeadTimeByProduct(startDate, endDate);
    }

    public List<InOutByProductRow> getInOutByProduct(
        LocalDate from,
        LocalDate to,
        String keyword,
        String type,
        String brand,
        Integer limit
    ) {
        validateRange(from, to);

        int safeLimit = (limit == null ? 200 : Math.min(Math.max(limit, 1), 500));

        String kw = StringUtils.hasText(keyword) ? keyword.trim() : null;
        String tp = StringUtils.hasText(type) ? type.trim() : null;
        String br = StringUtils.hasText(brand) ? brand.trim() : null;

        return mapper.selectInOutByProduct(from, to, kw, tp, br, safeLimit);
    }

    public List<String> getTypes() {
        return mapper.selectTypes();
    }

    public List<String> getBrandsByType(String type) {
        if (!StringUtils.hasText(type))
            throw new IllegalArgumentException("type 필수");
        return mapper.selectBrandsByType(type.trim());
    }

    public List<InOutByProductRow> searchProducts(String keyword, Integer limit) {
        if (!StringUtils.hasText(keyword))
            return List.of();
        int safeLimit = (limit == null ? 20 : Math.min(Math.max(limit, 1), 50));
        return mapper.searchProducts(keyword.trim(), safeLimit);
    }

    private void validateRange(LocalDate from, LocalDate to) {
        if (from == null || to == null)
            throw new IllegalArgumentException("기간 필수");
        if (from.isAfter(to))
            throw new IllegalArgumentException("시작일이 종료일보다 뒤일 수 없음");
        if (to.isAfter(LocalDate.now()))
            throw new IllegalArgumentException("미래 날짜 선택 불가");
        if (from.plusYears(1).isBefore(to))
            throw new IllegalArgumentException("날짜 설정 범위 한도 초과입니다.");
    }

    // ------------------------------------------------------------------

    // 거래처별 입출고 순위 통계

    public List<ClientRankRow> getInboundPartnerRank(LocalDate from, LocalDate to, Integer limit) {
        validateRange(from, to);

        int safeLimit = (limit == null ? 5 : Math.min(Math.max(limit, 1), 20));

        List<ClientRankRow> top = mapper.selectInboundPartnerRankTop(from, to, safeLimit);
        Long total = mapper.sumInboundPartnerRankTotal(from, to);
        if (total == null)
            total = 0L;

        long topSum = top.stream().mapToLong(r -> r.getQty() == null ? 0 : r.getQty()).sum();
        long other = total - topSum;

        if (other > 0) {
            top.add(new ClientRankRow("기타", other));
        }
        return top;
    }

    public List<ClientRankRow> getOutboundPartnerRank(LocalDate from, LocalDate to, Integer limit) {
        validateRange(from, to);

        int safeLimit = (limit == null ? 5 : Math.min(Math.max(limit, 1), 20));

        List<ClientRankRow> top = mapper.selectOutboundPartnerRankTop(from, to, safeLimit);
        Long total = mapper.sumOutboundPartnerRankTotal(from, to);
        if (total == null)
            total = 0L;

        long topSum = top.stream().mapToLong(r -> r.getQty() == null ? 0 : r.getQty()).sum();
        long other = total - topSum;

        if (other > 0) {
            top.add(new ClientRankRow("기타", other));
        }
        return top;
    }
	
	// -------------------------------------------------------
	// 품목별 수량 그래프
	
	public List<InboundSafeStockRow> getStockByProduct(String type, boolean unsafeOnly, Integer limit) {
		  int safeLimit = (limit == null ? 300 : Math.min(Math.max(limit, 1), 1000));
		  String tp = org.springframework.util.StringUtils.hasText(type) ? type.trim() : null;
		  return mapper.selectStockByProduct(tp, unsafeOnly, safeLimit);
		}
	
	// --------------------------------------------------------
	// 재고 회전율
	
	public List<StockRotationPoint> getStockRotationTrend(int year, Integer month, Long productId) {

        int thisYear = LocalDate.now().getYear();
        int lastYear = thisYear - 1;
        if (year != thisYear && year != lastYear) throw new IllegalArgumentException("년도 선택 불가");

        if (productId == null || productId <= 0) throw new IllegalArgumentException("productId 필수");

        if (month == null) {

            int maxMonth = (year == thisYear) ? LocalDate.now().getMonthValue() : 12;

            List<StockRotationPoint> out = new ArrayList<>();

            for (int m = 1; m <= maxMonth; m++) {
                LocalDate start = LocalDate.of(year, m, 1);
                LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

                if (year == thisYear && m == LocalDate.now().getMonthValue()) {
                    end = LocalDate.now();
                }

                out.add(calcPoint(productId, start, end, String.format("%02d월", m)));
            }

            return out;
        }

        // ✅ 주별 (년도+월)
        if (month < 1 || month > 12) throw new IllegalArgumentException("month 범위 오류");

        LocalDate monthStart = LocalDate.of(year, month, 1);
        LocalDate monthEnd = monthStart.withDayOfMonth(monthStart.lengthOfMonth());

        // 올해+이번달이면 금일까지
        if (year == thisYear && month == LocalDate.now().getMonthValue()) {
            monthEnd = LocalDate.now();
        }

        // 주별 구간 만들기(월요일~일요일 기준)
        List<StockRotationPoint> out = new ArrayList<>();
        LocalDate cur = monthStart;
        int weekIndex = 1;
        while (!cur.isAfter(monthEnd)) {
		    LocalDate start = cur;
		    LocalDate end = cur.with(java.time.DayOfWeek.SUNDAY);
		    if (end.isAfter(monthEnd)) end = monthEnd;

		    out.add(calcPoint(productId, start, end, weekIndex + "주차"));
		    weekIndex++;
		    cur = end.plusDays(1);
        }

        return out;
    }

	
	private StockRotationPoint calcPoint(Long productId, LocalDate start, LocalDate end, String label) {
	    LocalDateTime startAt = start.atStartOfDay();
	    LocalDateTime endAt = end.atTime(23, 59, 59);

	    Integer beginStockRaw = mapper.selectStockAt(productId, startAt); 
	    Integer endStockRaw = mapper.selectStockAt(productId, endAt); 
	    Long outboundRaw = mapper.selectOutboundQty(productId, start, end);


	    int beginStock = (beginStockRaw == null) ? 0 : beginStockRaw;
	    int endStock = (endStockRaw == null) ? 0 : endStockRaw;
	    long outbound = (outboundRaw == null) ? 0L : outboundRaw;

	
	    double avg = (beginStock + endStock) / 2.0; 
	    double turnover = (avg <= 0.0) ? 0.0 : (outbound / avg);

	    return StockRotationPoint.builder()
	            .period(label)
	            .outboundQty(outbound)
	            .beginStock(beginStock)
	            .endStock(endStock)
	            .avgStock(avg)
	            .turnover(turnover)
	            .build();
	}

    public List<StockRotationPoint> searchrotationProducts(String keyword, Integer limit){
        if(!StringUtils.hasText(keyword)) return List.of();
        int safeLimit = (limit == null ? 20 : Math.min(Math.max(limit, 1), 50));
        return mapper.searchrotationProducts(keyword.trim(), safeLimit);
    }


}



















