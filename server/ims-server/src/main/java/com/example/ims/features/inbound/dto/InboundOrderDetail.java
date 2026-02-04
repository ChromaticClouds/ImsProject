package com.example.ims.features.inbound.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InboundOrderDetail {
    private Long id;
    private Long userId;
    private String orderNumber;
    private LocalDate orderDate;
    private LocalDate receiveDate;
    private Integer qty;
    private Integer leadTime;
    private String status;
    private Long vendorItemId;
}
