package com.example.ims.features.auth.exceptions;

import com.example.ims.features.user.exceptions.UserError;
import com.example.ims.global.exceptions.BusinessException;

public class ForbiddenException extends BusinessException {
    public ForbiddenException() {
        super(AuthError.FORBIDDEN);
    }
}
