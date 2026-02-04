package com.example.ims.features.inbound.dto;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingDetailResponse {
    private String orderNumber;
    private LocalDate receiveDate;
    private Long vendorId;
    private String vendorName;
    private List<PendingItemRow> items;
}
