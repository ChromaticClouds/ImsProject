package com.example.ims.features.product.dto;

import com.example.ims.features.product.enums.ProductType;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ProductSuggest {
    private Long id;
    private Long productId;
    private String name;
    private String brand;
    private ProductType type;
    private Integer purchasePrice;
    private Integer salePrice;
    private Integer count;
    private String imageUrl;
    
    
    
}
