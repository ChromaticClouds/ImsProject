package com.example.ims.features.product.entities;

import com.example.ims.features.product.enums.ProductType;
import com.example.ims.features.stock.entities.Stock;
import com.example.ims.features.vendor.entities.VendorItem;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.BatchSize;

import java.util.List;

@Entity
@Table(name = "product")
@Getter
@Setter
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "product_code")
    private String productCode;

    private String name;

    @Enumerated(EnumType.STRING)
    private ProductType type;

    private String brand;

    @Column(name = "volume")
    private Integer volume;

    @Column(name = "per_count")
    private Integer perCount;

    @Column(name = "sale_price")
    private Integer salePrice;

    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "created_at")
    private String createdAt;

    @OneToOne(mappedBy = "product")
    private Stock stock;

    @OneToMany(mappedBy = "product")
    private List<VendorItem> vendorItems;
}
