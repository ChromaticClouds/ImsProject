package com.example.ims.features.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class VendorCreateRequestDto {

    private String type;        // Supplier / Seller
    private String vendorName;
    private String telephone;
    private String email;
    private String bossName;
    private String address;
    private String memo;
    private String imageUrl;
}
