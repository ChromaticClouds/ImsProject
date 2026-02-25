package com.example.ims.features.purchaseorder.dto;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.vendor.dto.Vendor;


import java.util.List;

public record PurchaseOrderContext(
    User user,
    String orderNumber,
    Vendor vendor,
    String receiveDate,
    List<Order> orders
) {}
