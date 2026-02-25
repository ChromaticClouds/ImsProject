package com.example.ims.features.purchaseorder.dto;

import com.example.ims.features.vendor.dto.Vendor;

import java.util.List;

public record PurchaseOrderPdfContent(
    String username,
    String email,
    String userRank,
    String receiveDate,
    String orderNumber,
    Vendor vendor,
    List<Line> lines,
    int totalAmount
) {
    public record Line(
        Long productId,
        String productName,
        String productType,
        String brand,
        int quantity,
        int unitPrice,
        int amount // 해당 Product의 총 구매가
    ) {}
}
