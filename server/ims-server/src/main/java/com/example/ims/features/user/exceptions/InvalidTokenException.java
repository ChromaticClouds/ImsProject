package com.example.ims.features.user.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class InvalidTokenException extends BusinessException {
    public InvalidTokenException() {
        super(UserError.INVALID_TOKEN);
    }
}
