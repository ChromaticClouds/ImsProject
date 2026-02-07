package com.example.ims.features.product.dto;

import com.example.ims.features.product.enums.ProductType;

import java.util.List;

public record ProductFilterResponse(
    List<ProductType> types,
    List<String> brands
) {}
