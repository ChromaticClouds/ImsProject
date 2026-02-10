package com.example.ims.features.auth.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class AuthFailException extends BusinessException {

	private static final long serialVersionUID = 1L;

	public AuthFailException(String message) {
        super(message);
    }
}
