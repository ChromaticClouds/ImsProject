package com.example.ims.global.exceptions;

import com.example.ims.features.auth.exceptions.ForbiddenException;
import com.example.ims.features.auth.exceptions.UnauthorizedException;
import com.example.ims.features.auth.stores.RefreshTokenCookieStore;

import com.example.ims.features.notice.exceptions.FileNotFoundException;
import com.example.ims.features.purchaseorder.exception.BuildPoContextException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.invitation.exceptions.InvalidInvitationTokenException;
import com.example.ims.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@RequiredArgsConstructor
@Slf4j
public class GlobalExceptionHandler {

    private final RefreshTokenCookieStore refreshTokenCookieStore;

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handle(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
            .map(error -> error.getField() + ": " + error.getDefaultMessage())
            .reduce((left, right) -> left + ", " + right)
            .orElse("잘못된 요청입니다.");

        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.fail(message));
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ApiResponse<Void>> handle(AccessDeniedException e) {
        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .body(ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handle(Exception e) {
        if (containsAccessDenied(e)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(ApiResponse.fail(e.getMessage()));
        }

        log.error("Unhandled exception while processing request", e);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ApiResponse.fail(e.getMessage()));
    }

    private boolean containsAccessDenied(Throwable throwable) {
        while (throwable != null) {
            if (throwable instanceof AccessDeniedException) {
                return true;
            }
            throwable = throwable.getCause();
        }
        return false;
    }

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
        ResponseCookie expired = refreshTokenCookieStore.delete();

        return ResponseEntity.status(HttpStatus.FORBIDDEN)
            .header(HttpHeaders.SET_COOKIE, expired.toString())
            .body(ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(FileNotFoundException.class)
    public ResponseEntity<ApiResponse<Void>> handle(FileNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ApiResponse.fail(e.getMessage()));
    }

    @ExceptionHandler(BuildPoContextException.class)
    public ResponseEntity<ApiResponse<Void>> handle(BuildPoContextException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
            .body(ApiResponse.fail(e.getMessage()));
    }
}



