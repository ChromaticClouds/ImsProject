package com.example.ims.features.adjust.dto;

public record AdjustItem(

    Long id,
    String name,
    String brand,
    String type,
    Integer currentStock,
    Integer purchasePrice,
    Integer salePrice,
    String imageUrl,
    Integer adjustCount
) {}
