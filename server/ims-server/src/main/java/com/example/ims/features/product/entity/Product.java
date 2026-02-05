package com.example.ims.features.product.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

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

    @Column(name = "type")
    private String type;

    private String brand;

    @Column(name = "volumn")
    private Integer volumn;

    @Column(name = "per_count")
    private Integer perCount;

    @Column(name = "sale_price")
    private Integer salePrice;

    @Column(name = "image_url")
    private String imageUrl;
    
    @Column(name = "created_at")
    private String createdAt;
    
}
