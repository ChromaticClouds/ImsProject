package com.example.ims.features.purchaseorder.exception;

import com.example.ims.global.exceptions.BusinessException;
import org.springframework.http.HttpStatus;

/** 같은 발주서를 다른 요청이 전송하는 중인 경우. 409로 응답한다. */
public class PurchaseOrderSendInProgressException extends BusinessException {

    public PurchaseOrderSendInProgressException() {
        super("발주서를 전송하는 중입니다. 잠시 후 전송 상태를 확인해 주세요.", HttpStatus.CONFLICT);
    }
}
