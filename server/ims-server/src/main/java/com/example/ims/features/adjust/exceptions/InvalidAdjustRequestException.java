package com.example.ims.features.adjust.exceptions;

import com.example.ims.global.exceptions.BusinessException;
import org.springframework.http.HttpStatus;

/** 재고조정 요청 값이 잘못된 경우. 400으로 응답한다. */
public class InvalidAdjustRequestException extends BusinessException {

    public InvalidAdjustRequestException(String message) {
        super(message, HttpStatus.BAD_REQUEST);
    }

    public InvalidAdjustRequestException(String message, Throwable cause) {
        super(message, HttpStatus.BAD_REQUEST);
        initCause(cause);
    }
}
