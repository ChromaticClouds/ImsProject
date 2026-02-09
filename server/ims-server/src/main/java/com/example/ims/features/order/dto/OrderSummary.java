package com.example.ims.features.order.dto;

import java.math.BigInteger;
import java.time.LocalDate;

public record OrderSummary(
    String orderNumber,
    String userName,
    String vendorName,
    String bossName,
    LocalDate orderDate,
    LocalDate receiveDate,
    Long itemCount,
    Long totalPrice
) {}
