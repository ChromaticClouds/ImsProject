package com.example.ims.features.user.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class InvalidPasswordException extends BusinessException {
    public InvalidPasswordException() {
        super(UserError.INVALID_PASSWORD);
    }
}
