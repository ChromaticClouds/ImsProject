package com.example.ims.features.order.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@ToString
public class OrderPostRequest {
    private Long userId;
    private Long sellerId;
    private LocalDate receiveDate;
    List<OrderProduct> products;
    private final LocalDate orderDate = LocalDate.now();
}
