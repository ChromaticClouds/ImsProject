package com.example.ims.features.stock.exceptions;

import com.example.ims.global.exceptions.BusinessException;
import org.springframework.http.HttpStatus;

public class StockNotFoundException extends BusinessException {
    public StockNotFoundException() {
        super(StockError.STOCK_NOT_FOUND, HttpStatus.NOT_FOUND);
    }
}
