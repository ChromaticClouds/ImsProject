package com.example.ims.features.purchaseorder.dto;

import java.time.LocalDate;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class PurchaseOrderInsertParam {
    private Long id; // generated
    private Long userId;
    private String orderNumber;
    private LocalDate orderDate;
    private LocalDate recieveDate;
    private Integer count;
    private Long vendorItemId;
}

