package com.example.ims.features.order.dto;

import java.math.BigInteger;
import java.time.LocalDate;

public record OrderSummary(
    String orderNumber,
    Long userId,
    Long vendorId,
    LocalDate orderDate,
    LocalDate receiveDate,
    BigInteger itemCount,
    BigInteger totalPrice
) {}
