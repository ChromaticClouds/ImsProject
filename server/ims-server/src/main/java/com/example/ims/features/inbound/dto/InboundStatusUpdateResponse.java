package com.example.ims.features.inbound.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InboundStatusUpdateResponse {
    private Long orderId;
    private String status;
    private LocalDate orderDate;
}
