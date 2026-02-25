package com.example.ims.features.order.dto;

import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;

public record OrderProduct(
    Long id,
    String productCode,
    String name,
    ProductType type,
    String brand,
    Integer salePrice,
    Integer perCount,
    Integer amount,         // 발주 수량
    Integer stockCount,     // 현재고 수량
    String imageUrl
) {
    public static OrderProduct from(Product product) {
        return new OrderProduct(
            product.getId(),
            product.getProductCode(),
            product.getName(),
            product.getType(),
            product.getBrand(),
            product.getSalePrice(),
            product.getPerCount(),
            0,
            product.getStock().getCount(),
            product.getImageUrl()
        );
    }
}
