package com.example.ims.features.stock.exceptions;

import com.example.ims.global.exceptions.BusinessException;
import org.springframework.http.HttpStatus;

public class StockEmptyException extends BusinessException {
    public StockEmptyException() {
        super(StockError.STOCK_EMPTY, HttpStatus.CONFLICT);
    }
}
