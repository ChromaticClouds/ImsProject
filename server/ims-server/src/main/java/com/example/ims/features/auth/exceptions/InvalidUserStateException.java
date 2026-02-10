package com.example.ims.features.auth.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class InvalidUserStateException extends BusinessException {
    public InvalidUserStateException() {
        super(AuthError.INVALID_STATE);
    }
}
