package com.example.ims.features.inbound.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PendingItemRow {
    private Long orderId;
    private Long vendorItemId;
    private Long productId;
    private String productName;
    private String type;
    private String brand;
    private Integer orderQty;
    private Integer purchasePrice;
    private Long lineAmount;
    private String imageUrl;
    private Integer salePrice;
}
