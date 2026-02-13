package com.example.ims.security.jwt;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.user.dto.UserPrincipal;
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
            UserRank userRank,
            UserRole userRole) {
        Instant now = Instant.now();

        return Jwts.builder()
                .subject(userId.toString())
                .claim("email", email)
                .claim("role", userRole.name())
                .claim("rank", userRank.name())
                .issuedAt(Date.from(now))
                .expiration(
                        getExpiration(now, props.getAccessExpMinutes(), ChronoUnit.MINUTES))
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

    public Authentication getAuthentication(String token) {
        Claims claims = parseClaims(token);

        Long userId = Long.valueOf(claims.getSubject());
        String email = claims.get("email", String.class);
        String role = claims.get("role", String.class);
        String rank = claims.get("rank", String.class);

        List<GrantedAuthority> authorities = new ArrayList<>();

        if (role != null)
            authorities.add(new SimpleGrantedAuthority("PERM_" + role));

        UserPrincipal principal
            = new UserPrincipal(userId, email, role, rank);

        return new UsernamePasswordAuthenticationToken(
            principal,
            null,
            authorities);
    }
}
