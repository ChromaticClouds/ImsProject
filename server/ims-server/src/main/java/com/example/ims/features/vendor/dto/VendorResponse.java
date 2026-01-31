package com.example.ims.features.vendor.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class VendorResponse {
    private Long id;
    private String type;
    private String vendorName;
    private String telephone;
    private String email;
    private String address;
}
