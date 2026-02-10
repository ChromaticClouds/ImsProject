package com.example.ims.features.user.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class PasswordMismatchException extends BusinessException {
    public PasswordMismatchException() {
        super(UserError.PASSWORD_MISMATCH);
    }
}
