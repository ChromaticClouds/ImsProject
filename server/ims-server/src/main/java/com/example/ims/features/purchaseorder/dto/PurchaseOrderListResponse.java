package com.example.ims.features.purchaseorder.dto;

import java.util.List;

import com.example.ims.features.inbound.dto.PageMeta;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PurchaseOrderListResponse {
    private List<PurchaseOrderGroupRow> content;
    private PageMeta page;
    private PurchaseOrderSummaryRow summary;

    public static PurchaseOrderListResponse of(List<PurchaseOrderGroupRow> content, PageMeta page, PurchaseOrderSummaryRow summary) {
        return PurchaseOrderListResponse.builder()
            .content(content)
            .page(page)
            .summary(summary)
            .build();
    }
}
