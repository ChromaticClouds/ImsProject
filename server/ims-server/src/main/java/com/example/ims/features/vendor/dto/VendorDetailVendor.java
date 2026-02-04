package com.example.ims.features.vendor.dto;

import java.time.LocalDateTime;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class VendorDetailVendor {
    private Long id;
    private String type;
    private String vendorName;
    private String telephone;
    private String email;
    private String bossName;
    private String address;
    private String memo;
    private String imageUrl;
    private LocalDateTime createdAt;
}
