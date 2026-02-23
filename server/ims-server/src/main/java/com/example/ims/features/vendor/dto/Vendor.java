package com.example.ims.features.vendor.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.enums.VendorStatus;
import com.example.ims.features.vendor.enums.VendorType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "vendor")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    private VendorType type;

    private String vendorName;
    private String telephone;
    private String email;
    private String bossName;
    private String address;
    private String memo;
    private String imageUrl;
    private LocalDateTime createdAt;

    @Enumerated(EnumType.STRING)
    private VendorStatus status;

    public static Vendor from(VendorCreateRequest req) {
        Vendor dto = new Vendor();
        dto.type = req.getType();
        dto.vendorName = req.getVendorName();
        dto.telephone = req.getTelephone();
        dto.email = req.getEmail();
        dto.bossName = req.getBossName();
        dto.address = req.getAddress();
        dto.memo = req.getMemo();
        return dto;
    }

    @OneToMany(mappedBy = "vendor")
    private List<VendorItem> vendorItems;
}
