package com.example.ims.features.statistics.services;

import com.example.ims.features.statistics.dto.ClientRankRow;
import com.example.ims.features.statistics.dto.InOutByProductRow;
import com.example.ims.features.statistics.dto.LeadTimeResponse;
import com.example.ims.features.statistics.dto.ProductShareResponse;
import com.example.ims.features.statistics.dto.WarehouseShareResponse;
import com.example.ims.features.statistics.mappers.StatisticsMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
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

	public List<LeadTimeResponse> getLeadTime() {
		return mapper.findLeadTimeByVendor();
	}

	public List<InOutByProductRow> getInOutByProduct(
			LocalDate from,
			LocalDate to,
			String keyword,
			String type,
			String brand,
			Integer limit) {
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
}
