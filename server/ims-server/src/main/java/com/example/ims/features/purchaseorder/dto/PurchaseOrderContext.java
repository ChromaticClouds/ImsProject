package com.example.ims.features.purchaseorder.dto;

import com.example.ims.features.order.entities.Order;
import com.example.ims.features.vendor.dto.Vendor;


import java.util.List;

public record PurchaseOrderContext(
    String orderNumber,
    Vendor vendor,
    List<Order> orders
) {}
