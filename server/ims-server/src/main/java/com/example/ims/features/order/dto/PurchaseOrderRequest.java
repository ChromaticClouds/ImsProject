package com.example.ims.features.order.dto;

import lombok.Getter;

import java.time.LocalDate;
import java.util.List;

@Getter
public class PurchaseOrderRequest {
    Long supplierId;
    List<PurchasePostItem> products;
    LocalDate date;
}
