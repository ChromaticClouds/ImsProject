package com.example.ims.features.purchaseorder.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class PurchaseOrderSummary {
    private long orderKinds;   // 발주서(그룹) 건수
    private long totalCount;   // 전체 수량 합
    private long totalPrice;   // 전체 구매단가 기준 합계(수량*purchase_price)
}
