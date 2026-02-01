package com.example.ims.features.auth.stores;

import java.time.Duration;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

@Component
public class RefreshTokenCookieStore {

    public static final String COOKIE_NAME = "refreshToken";
    private static final Duration TTL = Duration.ofDays(14);

    public static ResponseCookie store(
        String refreshToken,
        boolean secure
    ) {
        return ResponseCookie
            .from(COOKIE_NAME, refreshToken)
            .httpOnly(true)
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(TTL)
            .build();
    }

    public static ResponseCookie delete(boolean secure) {
        return ResponseCookie
            .from(COOKIE_NAME, "")
            .httpOnly(true)
            .secure(secure)
            .sameSite("Lax")
            .path("/")
            .maxAge(0)
            .build();
    }
}
