package com.example.ims.features.vendor.dto;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {
    
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

    public static Vendor from(VendorCreateRequest req) {
        Vendor dto = new Vendor();
        dto.type = req.getType();
        dto.vendorName = req.getVendorName();
        dto.telephone = req.getTelephone();
        dto.email = req.getEmail();
        dto.bossName = req.getBossName();
        dto.address = req.getAddress();
        dto.memo = req.getMemo();
        dto.imageUrl = req.getImageUrl();
        return dto;
    }
}
