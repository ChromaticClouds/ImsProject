package com.example.ims.features.product.dto;

import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;
import com.example.ims.global.dto.PageResponse;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.List;

public record ProductResponse(
    Long id,
    String imageUrl,
    String boxImageUrl,
    String productCode,
    String name,
    ProductType type,
    String brand,
    Integer salePrice,
    Integer perCount
) {
    public static PageResponse<ProductResponse> from(PageResponse<Product> products) {
        List<ProductResponse> productList = products.content().stream().map(product ->
            new ProductResponse(
                product.getId(),
                product.getImageUrl(),
                product.getBoxImageUrl(),
                product.getProductCode(),
                product.getName(),
                product.getType(),
                product.getBrand(),
                product.getSalePrice(),
                product.getPerCount()
            )
        ).toList();

        return new PageResponse<>(
            productList,
            products.page(),
            products.totalPages(),
            products.totalElements(),
            products.isFirst(),
            products.isLast()
        );
    }
}
