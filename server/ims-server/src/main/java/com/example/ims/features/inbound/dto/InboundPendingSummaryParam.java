package com.example.ims.features.inbound.dto;

import lombok.*;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InboundPendingSummaryParam {
    private LocalDate from;
    private LocalDate to;
    private String keyword;
    private int offset;
    private int size;
}
