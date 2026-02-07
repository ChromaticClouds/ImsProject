package com.example.ims.features.stock.exceptions;

import com.example.ims.global.exception.BusinessException;

public class StockEmptyException extends BusinessException {
    public StockEmptyException() {
        super(StockError.STOCK_EMPTY);
    }
}
