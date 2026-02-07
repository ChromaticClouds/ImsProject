package com.example.ims.features.outbound.dto;

import lombok.Data;

@Data
public class OutboundStockProductRow {

	private Long id;
    private Long productId;
    private String name;
    private String brand;
    private String type;
    private String volume;
    private Integer stockCount;
    
}
