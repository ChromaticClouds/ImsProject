package com.example.ims.features.purchaseorder.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderGroupRow {
    private String orderNumber;
    private LocalDate orderDate;
    private LocalDate recieveDate;
    private String status;

    private Long vendorId;
    private String vendorName;

    // 집계
    private Long itemKinds;     // 품목 종류 수(라인 수)
    private Long totalCount;    // 수량 합
    private Long totalPrice;    // 구매금액 합

    // 상세(팝오버)
    private List<PurchaseOrderItemRow> items;
}
