package com.example.ims.global.exceptions;

import com.example.ims.features.auth.exceptions.ForbiddenException;
import com.example.ims.features.auth.exceptions.UnauthorizedException;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.invitation.exceptions.InvalidInvitationTokenException;
import com.example.ims.global.response.ApiResponse;

import lombok.extern.slf4j.Slf4j;

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

    @ExceptionHandler(ForbiddenException.class)
    public ResponseEntity<ApiResponse<Void>> handle(ForbiddenException e) {
        ResponseCookie expired = ResponseCookie.from("refreshToken", "")
            .path("/")
            .httpOnly(true)
            .secure(true)
            .sameSite("Lax")
            .maxAge(0)
            .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .header(HttpHeaders.SET_COOKIE, expired.toString())
            .body(ApiResponse.fail(e.getMessage()));
    }
}



