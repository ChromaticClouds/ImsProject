package com.example.ims.features.vendor.exceptions;

import com.example.ims.global.exceptions.BusinessException;

public class VendorItemNotFoundException extends BusinessException {
    public VendorItemNotFoundException() {
        super(VendorItemError.VENDOR_ITEM_NOT_FOUND);
    }
}
