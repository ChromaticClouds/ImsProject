package com.example.ims.features.order.dto;

import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.enums.OrderStatus;

import java.time.LocalDate;

public record OrderResponse(
    Long id,
    String orderNumber,
    String userName,
    Integer count,
    LocalDate orderDate,
    LocalDate receiveDate,
    OrderStatus status
) {
    public static OrderResponse from(Order order) {
        return new OrderResponse(
            order.getId(),
            order.getOrderNumber(),
            order.getUser().getName(),
            order.getCount(),
            order.getOrderDate(),
            order.getRecieveDate(),
            order.getStatus()
        );
    }
}

