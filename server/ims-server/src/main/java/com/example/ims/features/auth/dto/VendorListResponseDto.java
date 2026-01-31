package com.example.ims.features.auth.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class VendorListResponseDto {

    private Long id;
    private String type;
    private String vendorName;
    private String telephone;
    private String email;
    private String address;
}
