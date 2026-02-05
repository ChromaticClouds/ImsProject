package com.example.ims.features.inbound.dto;

import lombok.Data;

@Data
public class InboundCompleteOrderRow {
    private Long orderId;
    private Long userId;
    private Long vendorItemId;
    private Integer orderQty; // o.`count`
    
}
