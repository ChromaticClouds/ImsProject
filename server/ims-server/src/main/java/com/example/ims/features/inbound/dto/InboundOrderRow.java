package com.example.ims.features.inbound.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InboundOrderRow {
    private Long id;
    private Long userId;
    private String orderNumber;

    private LocalDate orderDate;    // 완료 탭에서는 완료일 의미로 사용
    private LocalDate receiveDate;  // 대기 탭에서 필터 기준

    private Integer qty;            // `count`
    private String status;

    private Long vendorItemId;
}