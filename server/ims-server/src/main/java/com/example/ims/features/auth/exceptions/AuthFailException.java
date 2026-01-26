package com.example.ims.features.auth.exceptions;

import com.example.ims.global.exception.BusinessException;

public class AuthFailException extends BusinessException {

    public AuthFailException(String message) {
        super(message);
    }
}
