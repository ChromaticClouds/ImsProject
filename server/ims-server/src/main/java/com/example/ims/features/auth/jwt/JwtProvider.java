package com.example.ims.features.auth.jwt;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;

import org.springframework.stereotype.Component;

import com.example.ims.features.auth.entities.UserRole;
import com.example.ims.global.properties.JwtProperties;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JwtProvider {

    private final JwtKeyProvider keyProvider;
    private final JwtProperties props;

    public Date getExpiration(Instant now, Long exp, ChronoUnit unit) {
        return Date.from(now.plus(exp, unit));
    }

    public String createAccessToken(
        Long userId,
        String email,
        UserRole userRole
    ) {
        Instant now = Instant.now();

        return Jwts.builder()
            .subject(userId.toString())
            .claim("email", email)
            .claim("role", userRole.name())
            .issuedAt(Date.from(now))
            .expiration(
                getExpiration(now, props.getAccessExpMinutes(), ChronoUnit.MINUTES)
            )
            .signWith(keyProvider.getKey())
            .compact();
    }

    public String createRefreshToken(Long userId) {
        Instant now = Instant.now();

        return Jwts.builder()
            .subject(userId.toString())
            .issuedAt(Date.from(now))
            .expiration(getExpiration(now, props.getRefreshExpDays(), ChronoUnit.DAYS))
            .signWith(keyProvider.getKey())
            .compact();
    }
    
    public Claims parseClaims(String token) {
    	return Jwts.parser()
    		.verifyWith(keyProvider.getKey())
    		.build()
    		.parseSignedClaims(token)
    		.getPayload();
    }
    
    public boolean validate(String token) {
    	try {
    		parseClaims(token);
    		return true;
    	} catch (JwtException | IllegalArgumentException e) {
    		return false;
    	}
    }
}
