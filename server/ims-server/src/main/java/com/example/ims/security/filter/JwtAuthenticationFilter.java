package com.example.ims.security.filter;

import java.io.IOException;
import java.util.Set;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.ims.security.jwt.JwtProvider;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Set<String> PUBLIC_PATHS = Set.of(
        "/api/health",
        "/api/invitation/token",
        "/api/user/forgot-password",
        "/api/user/password-reset"
    );

    private final JwtProvider jwtProvider;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        return "OPTIONS".equalsIgnoreCase(request.getMethod())
            || !path.startsWith("/api/")
            || path.startsWith("/api/auth/")
            || PUBLIC_PATHS.contains(path);
    }

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            writeUnauthorized(
                response,
                "세션이 만료됐거나 인증되지 않은 사용자입니다."
            );
            return;
        }

        String token = authHeader.substring(7);

        try {
            if (jwtProvider.validate(token)) {
                Authentication authentication = jwtProvider.getAuthentication(token);
                SecurityContextHolder.getContext().setAuthentication(authentication);
                filterChain.doFilter(request, response);
                return;
            }

            writeUnauthorized(
                response,
                "토큰이 만료됐거나 유효하지 않습니다."
            );
        } catch (Exception e) {
            writeUnauthorized(response, "접근 권한이 없습니다.");
        }
    }

    private void writeUnauthorized(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType("application/json;charset=UTF-8");
        response.getWriter().write("""
            {
              "success": false,
              "message": "%s"
            }
            """.formatted(message));
    }
}
