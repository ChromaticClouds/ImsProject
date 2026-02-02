package com.example.ims.features.vendor.dto;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class VendorDetailResponse {
    private VendorDetailVendor vendor;               // 기본 정보
    private List<VendorItemResponse> items;      // 판매처면 빈 배열, 공급처면 품목/단가
}
