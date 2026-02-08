package com.example.ims.features.product.exceptions;

import com.example.ims.global.exception.BusinessException;

public class ProductNotFoundException extends BusinessException {
    public ProductNotFoundException() {
        super(ProductError.PRODUCT_NOT_FOUND);
    }
}
