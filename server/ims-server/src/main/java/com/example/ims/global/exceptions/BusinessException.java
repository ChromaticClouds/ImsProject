package com.example.ims.global.exceptions;

import org.springframework.http.HttpStatus;

public class BusinessException extends RuntimeException {

    private final HttpStatus httpStatus;

    public BusinessException(String message) {
        this(message, null);
    }

    public BusinessException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }

    /**
     * 응답으로 내려줄 HTTP 상태. 지정하지 않으면 null이며,
     * 이 경우 GlobalExceptionHandler가 기존처럼 처리한다.
     */
    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
