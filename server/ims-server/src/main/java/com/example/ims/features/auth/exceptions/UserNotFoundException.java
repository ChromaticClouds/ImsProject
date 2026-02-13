package com.example.ims.features.auth.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class UserNotFoundException extends BusinessException {
    
	private static final long serialVersionUID = 1L;

	public UserNotFoundException() {
        super(AuthError.USER_NOT_FOUND);
    }
}
