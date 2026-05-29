package com.example.ims.security.filter;

import com.example.ims.security.jwt.JwtProvider;
import jakarta.servlet.FilterChain;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.concurrent.atomic.AtomicBoolean;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JwtAuthenticationFilterUnitTest {

    @Mock
    JwtProvider jwtProvider;

    @AfterEach
    void clearSecurityContext() {
        SecurityContextHolder.clearContext();
    }

    @Test
    @DisplayName("보호 API에 토큰이 없으면 컨트롤러 진입 전에 401을 반환한다")
    void protectedApiWithoutTokenReturnsUnauthorizedBeforeBusinessLogic() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtProvider);
        MockHttpServletRequest request = request("POST", "/api/purchase-orders/send");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);

        filter.doFilter(request, response, chain(chainCalled));

        assertEquals(401, response.getStatus());
        assertFalse(chainCalled.get());
        assertTrue(response.getContentAsString().contains("인증되지 않은 사용자"));
    }

    @Test
    @DisplayName("공개 API는 토큰 없이도 다음 필터 체인으로 넘긴다")
    void publicApiWithoutTokenPassesThrough() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtProvider);
        MockHttpServletRequest request = request("POST", "/api/auth/login");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);

        filter.doFilter(request, response, chain(chainCalled));

        assertTrue(chainCalled.get());
        assertEquals(200, response.getStatus());
    }

    @Test
    @DisplayName("유효한 토큰이면 인증 컨텍스트를 채우고 비즈니스 로직으로 넘긴다")
    void validTokenPassesThroughToBusinessLogic() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtProvider);
        MockHttpServletRequest request = request("POST", "/api/purchase-orders/send");
        request.addHeader("Authorization", "Bearer access-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);
        var authentication = new UsernamePasswordAuthenticationToken("user", null);

        when(jwtProvider.validate("access-token")).thenReturn(true);
        when(jwtProvider.getAuthentication("access-token")).thenReturn(authentication);

        filter.doFilter(request, response, chain(chainCalled));

        assertTrue(chainCalled.get());
        assertEquals(authentication, SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    @DisplayName("유효하지 않은 토큰이면 비즈니스 로직으로 넘기지 않고 401을 반환한다")
    void invalidTokenReturnsUnauthorizedBeforeBusinessLogic() throws Exception {
        JwtAuthenticationFilter filter = new JwtAuthenticationFilter(jwtProvider);
        MockHttpServletRequest request = request("POST", "/api/purchase-orders/send");
        request.addHeader("Authorization", "Bearer bad-token");
        MockHttpServletResponse response = new MockHttpServletResponse();
        AtomicBoolean chainCalled = new AtomicBoolean(false);

        when(jwtProvider.validate("bad-token")).thenReturn(false);

        filter.doFilter(request, response, chain(chainCalled));

        assertEquals(401, response.getStatus());
        assertFalse(chainCalled.get());
        assertTrue(response.getContentAsString().contains("유효하지 않습니다"));
    }

    private MockHttpServletRequest request(String method, String servletPath) {
        MockHttpServletRequest request = new MockHttpServletRequest(method, servletPath);
        request.setServletPath(servletPath);
        return request;
    }

    private FilterChain chain(AtomicBoolean chainCalled) {
        return (request, response) -> chainCalled.set(true);
    }
}
