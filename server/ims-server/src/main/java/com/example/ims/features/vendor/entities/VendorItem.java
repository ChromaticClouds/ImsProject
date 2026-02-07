package com.example.ims.features.vendor.entities;

import com.example.ims.features.product.entities.Product;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.enums.VendorItemStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "vendor_item")
@Getter
@Setter
public class VendorItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // N : 1  (VendorItem → Product)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    // N : 1  (VendorItem → Vendor)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vendor_id", nullable = false)
    private Vendor vendor;

    @Column(name = "purchase_price")
    private Integer purchasePrice;

    @Enumerated(EnumType.STRING)
    private VendorItemStatus status;
}

