package com.example.ims.features.product.enums;

public enum ProductType {
    SOJU("소주"),
    WHISKEY("위스키"),
    LIQUOR("양주"),
    TRADITIONAL("전통주"),
    KAOLIANG_LIQUOR("고량주");

    private final String label;

    private ProductType(String label) {
        this.label = label;
    }

    public String format() {
        return label;
    }
}
