package com.example.ims.features.purchaseorder.dto;

import com.example.ims.features.purchaseorder.enums.PurchaseOrderSendFailStage;

import java.util.List;

public record SendGroupResult(
        List<Success> success,
        List<Fail> failed
) {
    public record Success(String orderNumber) {}
    public record Fail(String orderNumber, PurchaseOrderSendFailStage stage, String reason) {}
}
