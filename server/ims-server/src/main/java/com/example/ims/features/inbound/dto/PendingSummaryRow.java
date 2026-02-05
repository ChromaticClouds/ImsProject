package com.example.ims.features.inbound.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingSummaryRow {
    private String statusText;     // "입고 대기"
    private LocalDate receiveDate; // 입고 예정일 (DB: recieve_date)
    private String orderNumber;    // 발주번호
    private Long vendorId;
    private String vendorName;     // 거래처
    private Integer itemCount;     // 품목 수(=라인 수)
    private Long totalAmount;      // 단가 총액 = SUM(count * purchase_price)
}


