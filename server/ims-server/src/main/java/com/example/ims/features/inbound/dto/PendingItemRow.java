package com.example.ims.features.inbound.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingItemRow {
    private Long orderId;          // order.id
    private Long vendorItemId;

    private Long productId;
    private String productName;    // 품목명
    private String type;           // 주종
    private String brand;          // 브랜드

    private Integer orderQty;      // 발주 수량
    private Integer purchasePrice; // 구매단가
    private Long lineAmount;       // 수량 * 구매단가
    private String imageUrl;       // 제품 이미지
    private Integer salePrice;     // 판매단가
}