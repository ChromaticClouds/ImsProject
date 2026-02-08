package com.example.ims.features.outbound.dto;

import lombok.*;

@Data
public class OutboundCompleteOrderRow {
    private Long userId;
    private Long orderId;
    private Long productId;
    private Integer orderQty;
    
    private Long sellerVendorId;
    
    public Long getSellerVendorId() {
    	return sellerVendorId;
    }
    
    public void setSellerVendorId(Long sellerVendorId) {
    	this.sellerVendorId = sellerVendorId;
    }
    
}
