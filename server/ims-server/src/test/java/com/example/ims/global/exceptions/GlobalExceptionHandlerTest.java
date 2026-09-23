package com.example.ims.global.exceptions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import com.example.ims.features.auth.stores.RefreshTokenCookieStore;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.security.access.AccessDeniedException;

class GlobalExceptionHandlerTest {

    @Test
    void accessDeniedExceptionReturnsForbidden() {
        RefreshTokenCookieStore refreshTokenCookieStore = mock(RefreshTokenCookieStore.class);
        GlobalExceptionHandler handler = new GlobalExceptionHandler(refreshTokenCookieStore);

        var response = handler.handle(new AccessDeniedException("Access Denied"));

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Access Denied", response.getBody().getMessage());
    }

    @Test
    void wrappedAccessDeniedExceptionReturnsForbidden() {
        RefreshTokenCookieStore refreshTokenCookieStore = mock(RefreshTokenCookieStore.class);
        GlobalExceptionHandler handler = new GlobalExceptionHandler(refreshTokenCookieStore);

        var response = handler.handle(
            new RuntimeException("Servlet dispatch failed",
                new AccessDeniedException("Access Denied"))
        );

        assertEquals(HttpStatus.FORBIDDEN, response.getStatusCode());
        assertEquals("Servlet dispatch failed", response.getBody().getMessage());
    }
    @Test
    void requestValidationFailureReturnsBadRequest() {
        RefreshTokenCookieStore refreshTokenCookieStore = mock(RefreshTokenCookieStore.class);
        GlobalExceptionHandler handler = new GlobalExceptionHandler(refreshTokenCookieStore);
        var target = new Object();
        var bindingResult = new BeanPropertyBindingResult(target, "request");
        bindingResult.addError(new FieldError("request", "recieveDate", null, false, null, null, "must not be null"));

        var response = handler.handle(
            new MethodArgumentNotValidException(null, bindingResult)
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("recieveDate: must not be null", response.getBody().getMessage());
    }

    @Test
    void emptyCollectionValidationFailureReturnsBadRequest() {
        RefreshTokenCookieStore refreshTokenCookieStore = mock(RefreshTokenCookieStore.class);
        GlobalExceptionHandler handler = new GlobalExceptionHandler(refreshTokenCookieStore);
        var target = new Object();
        var bindingResult = new BeanPropertyBindingResult(target, "request");
        bindingResult.addError(new FieldError(
            "request", "orderNumbers", null, false, null, null, "must not be empty"
        ));

        var response = handler.handle(
            new MethodArgumentNotValidException(null, bindingResult)
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("orderNumbers: must not be empty", response.getBody().getMessage());
    }

    @Test
    void malformedFieldValidationFailureReturnsBadRequest() {
        RefreshTokenCookieStore refreshTokenCookieStore = mock(RefreshTokenCookieStore.class);
        GlobalExceptionHandler handler = new GlobalExceptionHandler(refreshTokenCookieStore);
        var target = new Object();
        var bindingResult = new BeanPropertyBindingResult(target, "request");
        bindingResult.addError(new FieldError(
            "request", "emails[0]", "not-an-email", false, null, null, "must be a well-formed email address"
        ));

        var response = handler.handle(
            new MethodArgumentNotValidException(null, bindingResult)
        );

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertEquals("emails[0]: must be a well-formed email address", response.getBody().getMessage());
    }

}
