package com.example.ims.features.auth.exceptions;

import com.example.ims.global.exception.BusinessException;

public class UnauthorizedException extends BusinessException {

	private static final long serialVersionUID = 1L;

	public UnauthorizedException() {
		super(AuthError.UNAUTORIZED);
	}
}
