package com.example.ims.features.purchaseorder.exception;

import com.example.ims.global.exceptions.BusinessException;
import org.springframework.http.HttpStatus;

/** 이미 전송된 발주서를 다시 전송하려는 경우. 409로 응답한다. */
public class PurchaseOrderAlreadySentException extends BusinessException {

    public PurchaseOrderAlreadySentException() {
        super("이미 전송된 발주서입니다.", HttpStatus.CONFLICT);
    }
}
