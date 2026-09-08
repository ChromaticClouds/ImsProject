package com.example.ims.features.auth.stores;

import java.time.Duration;

import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Component;

import com.example.ims.global.properties.AuthCookieProperties;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RefreshTokenCookieStore {

    public static final String COOKIE_NAME = "refreshToken";
    private static final Duration TTL = Duration.ofDays(14);
    private final AuthCookieProperties properties;

    public ResponseCookie store(String refreshToken) {
        return ResponseCookie
            .from(COOKIE_NAME, refreshToken)
            .httpOnly(true)
            .secure(properties.isSecure())
            .sameSite(properties.getSameSite())
            .path("/")
            .maxAge(TTL)
            .build();
    }

    public ResponseCookie delete() {
        return ResponseCookie
            .from(COOKIE_NAME, "")
            .httpOnly(true)
            .secure(properties.isSecure())
            .sameSite(properties.getSameSite())
            .path("/")
            .maxAge(0)
            .build();
    }
}
