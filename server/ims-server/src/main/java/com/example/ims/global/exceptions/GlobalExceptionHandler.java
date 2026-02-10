package com.example.ims.global.exceptions;

import com.example.ims.features.auth.exceptions.UnauthorizedException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.invitation.exceptions.InvalidInvitationTokenException;
import com.example.ims.global.response.ApiResponse;

@RestControllerAdvice
public class GlobalExceptionHandler {
    
    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handle(UserNotFoundException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ApiResponse<Void>> handle(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.fail(GlobalError.UNEXPECTED_ERROR));
    }

    @ExceptionHandler(InvalidInvitationTokenException.class)
    public ResponseEntity<ApiResponse<Void>> handle(InvalidInvitationTokenException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(UnauthorizedException.class)
    public ResponseEntity<ApiResponse<Void>> handle(UnauthorizedException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(ApiResponse.fail(e.getMessage()));
    }
}



