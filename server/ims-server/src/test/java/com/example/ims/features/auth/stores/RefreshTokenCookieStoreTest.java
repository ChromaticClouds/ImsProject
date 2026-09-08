package com.example.ims.features.auth.stores;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.springframework.http.ResponseCookie;

import com.example.ims.global.properties.AuthCookieProperties;

class RefreshTokenCookieStoreTest {

    @Test
    void storesSameSiteRefreshCookieWithConfiguredSecurityAttributes() {
        AuthCookieProperties properties = new AuthCookieProperties();
        RefreshTokenCookieStore store = new RefreshTokenCookieStore(properties);

        ResponseCookie cookie = store.store("refresh-token");

        assertEquals(RefreshTokenCookieStore.COOKIE_NAME, cookie.getName());
        assertEquals("refresh-token", cookie.getValue());
        assertTrue(cookie.isHttpOnly());
        assertTrue(cookie.isSecure());
        assertEquals("Lax", cookie.getSameSite());
        assertEquals("/", cookie.getPath());
    }

    @Test
    void deletesCookieUsingTheSameConfiguredAttributes() {
        AuthCookieProperties properties = new AuthCookieProperties();
        RefreshTokenCookieStore store = new RefreshTokenCookieStore(properties);

        ResponseCookie cookie = store.delete();

        assertEquals("", cookie.getValue());
        assertEquals(0, cookie.getMaxAge().getSeconds());
        assertTrue(cookie.isSecure());
        assertEquals("Lax", cookie.getSameSite());
    }

    @Test
    void rejectsInsecureCrossSiteCookieConfiguration() {
        AuthCookieProperties properties = new AuthCookieProperties();
        properties.setSecure(false);
        properties.setSameSite("None");

        assertFalse(properties.isSameSiteConfigurationValid());

        properties.setSameSite("Lax");

        assertTrue(properties.isSameSiteConfigurationValid());
    }
}
