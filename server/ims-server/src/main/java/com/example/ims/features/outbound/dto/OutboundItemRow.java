package com.example.ims.features.outbound.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class OutboundItemRow {
    private Long orderId;
    private Long productId;
    private String type;
    private String productName;
    private String brand;
    private Integer orderQty;
    private Integer salePrice;
    private Integer stockCount;
    private Integer shortage;
    
    private Integer purchasePrice;
    private Long lineAmount;        // orderQty * salePrice (또는 purchasePrice)
    private String imageUrl;
    private Integer currentStock;   // stock.count
    private Long vendorItemId;
}
