package com.example.ims.features.vendor.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class VendorCreateRequest {

    private String type;
    private String vendorName;
    private String telephone;
    private String email;
    private String bossName;
    private String address;
    private String memo;
    private String imageUrl;
}
