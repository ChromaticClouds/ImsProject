package com.example.ims.global.exceptions;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;

import com.example.ims.features.auth.stores.RefreshTokenCookieStore;
import org.junit.jupiter.api.Test;
import org.springframework.http.HttpStatus;
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
}
