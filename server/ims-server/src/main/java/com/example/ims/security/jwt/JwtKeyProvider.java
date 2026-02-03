package com.example.ims.security.jwt;

import java.nio.charset.StandardCharsets;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;

import com.example.ims.global.properties.JwtProperties;

import io.jsonwebtoken.security.Keys;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtKeyProvider {
    
    private final JwtProperties props;

    public SecretKey getKey() {
        return Keys.hmacShaKeyFor(
            props.getSecret().getBytes(StandardCharsets.UTF_8)
        );
    }
}
