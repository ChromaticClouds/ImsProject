package com.example.ims.features.purchaseorder.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderSummaryRow {
    private long orderKinds;   // 발주서 건수 (order_number distinct)
    private long totalCount;   // 전체 수량 합
    private long totalPrice;   // 전체 구매금액 합 (count * purchase_price)
}
