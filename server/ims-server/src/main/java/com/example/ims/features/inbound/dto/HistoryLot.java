package com.example.ims.features.inbound.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class HistoryLot {
    private Long id;
    private Long userId;
    private String status; // 'INBOUND'
    private String memo;
}
