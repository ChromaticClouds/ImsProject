package com.example.ims.features.notice.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class NoticeAuthException extends BusinessException {
    public NoticeAuthException() {
        super(NoticeError.NOTICE_AUTH_ERROR);
    }
}
