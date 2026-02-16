package com.example.ims.features.order.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class OrderNotFoundException extends BusinessException {

    public OrderNotFoundException(String orderNumber) {
        super("해당 주문 번호의 주문이 존재하지 않습니다 = " + orderNumber);
    }

    public OrderNotFoundException() {
        super("조회된 건이 존재하지 않습니다.");
    }
}
