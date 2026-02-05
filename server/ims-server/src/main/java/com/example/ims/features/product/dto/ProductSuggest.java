package com.example.ims.features.product.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ProductSuggest {
    private Long id;
    private Long productId;
    private String name;
    private String brand;
    private String type;
    private Integer purchasePrice;
    private Integer salePrice;
    private Integer count;
    private String imageUrl;
}
