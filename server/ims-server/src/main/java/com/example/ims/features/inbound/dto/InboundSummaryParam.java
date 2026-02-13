package com.example.ims.features.inbound.dto;

import lombok.*;
import java.time.LocalDate;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
public class InboundSummaryParam {
    private String status;   // INBOUND_PENDING / INBOUND_COMPLETE
    private LocalDate from;
    private LocalDate to;
    private String keyword;
    private int offset;
    private int size;
    
    private Boolean todayOnly;
}
