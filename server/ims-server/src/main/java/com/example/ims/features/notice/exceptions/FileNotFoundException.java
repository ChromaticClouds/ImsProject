package com.example.ims.features.notice.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class FileNotFoundException extends BusinessException {
    public FileNotFoundException() {
        super(NoticeError.FILE_NOT_FOUND);
    }
}
