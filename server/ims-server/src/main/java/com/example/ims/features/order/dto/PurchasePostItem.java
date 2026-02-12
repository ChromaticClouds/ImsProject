package com.example.ims.features.order.dto;

import com.example.ims.features.product.enums.ProductType;
import lombok.Getter;

/**
 * 발주서 작성: 품목 요청 리퀘스트 DTO
 */
@Getter
public class PurchasePostItems {
    private Long id;
    private String name;
    private ProductType type;
    private String brand;
    private Integer salePrice;
    private Integer count;
    private String imageUrl;
}
