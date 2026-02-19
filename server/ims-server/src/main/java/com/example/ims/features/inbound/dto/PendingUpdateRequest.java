package com.example.ims.features.inbound.dto;

import java.time.LocalDate;
import java.util.List;
import lombok.*;

@Getter 
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
public class PendingUpdateRequest {
    private String memo;         // 전체 납기일(선택)
    private List<Item> items;              // 라인별 수량 변경(선택)

@Getter
@Setter
@NoArgsConstructor 
@AllArgsConstructor 
@Builder
    public static class Item {
        private Long orderId;
        private Integer orderQty;          // order.count
    }
}
