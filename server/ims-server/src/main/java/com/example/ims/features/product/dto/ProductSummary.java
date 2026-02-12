package com.example.ims.features.product.dto;

import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;

public record ProductSummary(
    Long id,
    String name,
    ProductType type,
    String brand,
    Integer salePrice,
    String imageUrl
) {
    public static ProductSummary from(Product product) {
        return new ProductSummary(
            product.getId(),
            product.getName(),
            product.getType(),
            product.getBrand(),
            product.getSalePrice(),
            product.getImageUrl()
        );
    }
}
