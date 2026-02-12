package com.example.ims.features.vendor.dto;

public record VendorIdentifier (
    Long id,
    String name
) {
    public static VendorIdentifier from(Vendor vendor) {
        return new VendorIdentifier(
            vendor.getId(),
            vendor.getVendorName()
        );
    }
}
