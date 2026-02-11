package com.example.ims.features.vendor.dto;

import java.util.List;

import com.example.ims.features.vendor.enums.VendorType;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@Setter
@ToString
@NoArgsConstructor
public class VendorCreateRequest {
    private VendorType type;        // "Supplier" | "Seller"
    private String vendorName;
    private String telephone;
    private String email;
    private String bossName;
    private String address;
    private String memo;

    // Supplier일 때만 사용
    private List<VendorItemCreate> items;

    @Getter
    @Setter
    @NoArgsConstructor
    public static class VendorItemCreate {
        private Long productId;
        private Integer purchasePrice;
    }
}

