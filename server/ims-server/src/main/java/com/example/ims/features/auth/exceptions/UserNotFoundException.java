package com.example.ims.features.auth.exceptions;

import com.example.ims.global.exception.BusinessException;

public class UserNotFoundException extends BusinessException {
    public UserNotFoundException(String message) {
        super(message);
    }
}
