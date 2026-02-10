package com.example.ims.features.inbound.dto;

import lombok.Data;

@Data
public class InboundSafeStockRow {
	private Long productId;
	private Integer maxOutbound;
	private Integer maxLeadTime;
	private Double avgOutbound;
	private Double avgLeadTime;
	private Integer safetyStock;
	
}
