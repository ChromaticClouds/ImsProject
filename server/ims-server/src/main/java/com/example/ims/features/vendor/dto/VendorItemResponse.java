package com.example.ims.features.vendor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorItemResponse {
    private Long productId;
    private String productName;
    private Integer purchasePrice;
}

