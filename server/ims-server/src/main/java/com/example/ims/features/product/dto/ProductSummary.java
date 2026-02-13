package com.example.ims.features.product.dto;

import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;

public record ProductSummary(
    Long id,
    Long vendorItemId,
    String name,
    ProductType type,
    String brand,
    Integer salePrice,
    String imageUrl
) {}
