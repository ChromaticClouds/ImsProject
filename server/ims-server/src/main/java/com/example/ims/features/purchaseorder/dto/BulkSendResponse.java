package com.example.ims.features.purchaseorder.dto;

import java.util.List;

public record BulkSendResponse(
        int total,
        int successCount,
        int failCount,
        List<String> success,
        List<Fail> failed
) {
    public record Fail(String orderNumber, String stage, String reason) {}

    public static BulkSendResponse from(
        SendGroupResult result,
        int total
    ) {
        List<String> success = result.success().stream()
            .map(SendGroupResult.Success::orderNumber)
            .toList();

        List<Fail> failed = result.failed().stream()
            .map(f -> new Fail(f.orderNumber(), f.stage(), safeMsg(f.reason())))
            .toList();

        return new BulkSendResponse(
            total,
            success.size(),
            failed.size(),
            success,
            failed
        );
    }

    private static String safeMsg(String msg) {
        return (msg == null || msg.isBlank()) ? "UNKNOWN_ERROR" : msg;
    }
}
