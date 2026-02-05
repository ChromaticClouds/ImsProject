package com.example.ims.features.inbound.dto;

import lombok.*;

import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class CompletedSummaryRow {
    private String statusText;    // "입고 완료"
    private String orderNumber;
    private LocalDate orderDate;  // MIN(order_date)
    private Long vendorId;
    private String vendorName;
    private Long itemCount;
    private Long totalAmount;
}
