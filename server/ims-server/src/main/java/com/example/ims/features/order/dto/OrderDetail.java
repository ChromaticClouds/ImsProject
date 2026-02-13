package com.example.ims.features.order.dto;

import com.example.ims.features.product.enums.ProductType;

public record OrderDetail(
    Long id,
    String name,
    ProductType itemType,
    String brand,
    Integer count,
    String imageUrl
) {}
