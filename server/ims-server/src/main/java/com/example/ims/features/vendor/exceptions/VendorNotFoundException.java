package com.example.ims.features.vendor.exceptions;

import com.example.ims.global.exception.BusinessException;

public class VendorNotFoundException extends BusinessException {
    public VendorNotFoundException() {
        super(VendorError.VENDOR_NOT_FOUND);
    }
}
