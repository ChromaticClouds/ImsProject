package com.example.ims.features.user.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class NoPermissionException extends BusinessException {
    public NoPermissionException() {
        super(UserError.NO_PERMISSION);
    }
}
