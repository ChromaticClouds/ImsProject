package com.example.ims.features.vendor.dto;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
public class VendorListResponse {
    
    private List<VendorResponse> list;
    private PageInfo pageInfo;
}
