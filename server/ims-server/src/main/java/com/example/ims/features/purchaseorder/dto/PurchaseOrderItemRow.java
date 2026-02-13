package com.example.ims.features.purchaseorder.dto;

import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor @Builder
public class PurchaseOrderItemRow {
    private String orderNumber;      // 그룹핑용
    private Long orderId;            // orders.id (수정용)
    private Long vendorItemId;       // orders.vendor_item_id
    private Long productId;

    private String productName;
    private String type;
    private String brand;

    private Double safetyStock;        // 계산 결과
    private Long count;              // orders.count
    private Long purchasePrice;      // vendor_item.purchase_price
}


