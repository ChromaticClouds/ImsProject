package com.example.ims.features.inbound.dto;

import lombok.Data;

@Data
public class InboundSafeStockRow {
	private Long productId;
	private Integer maxOutbound;
	private Integer maxLeadTime;
	private Double avgOutbound;
	private Double avgLeadTime;
	private Double safetyStock;
	
	// 품목별 수량 그래프
	private String productName;
	private String type;
	private String brand;
	private Long stockCount;
	
}
