package com.example.ims.features.purchaseorder.dto;

import java.util.List;

public record LoadGroupResult(
    List<PurchaseOrderContext> contexts,
    List<Fail> failed
) {
    public record Fail(String orderNumber, String reason) {}
}
