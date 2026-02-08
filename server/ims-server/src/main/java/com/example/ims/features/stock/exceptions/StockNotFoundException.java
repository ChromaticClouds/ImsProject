package com.example.ims.features.stock.exceptions;

import com.example.ims.global.exception.BusinessException;

public class StockNotFoundException extends BusinessException {
    public StockNotFoundException() {
        super(StockError.STOCK_NOT_FOUND);
    }
}
