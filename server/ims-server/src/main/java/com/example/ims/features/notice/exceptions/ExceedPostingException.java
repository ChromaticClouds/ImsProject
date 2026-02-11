package com.example.ims.features.notice.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class ExceedPostingException extends BusinessException {
    public ExceedPostingException() {
        super(NoticeError.EXCEED_POSTING);
    }
}
