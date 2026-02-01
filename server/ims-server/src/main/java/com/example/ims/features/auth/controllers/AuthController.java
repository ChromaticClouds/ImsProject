package com.example.ims.features.auth.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.auth.dto.AuthResponse;
import com.example.ims.features.auth.dto.LoginRequest;
import com.example.ims.features.auth.dto.AuthResult;
import com.example.ims.features.auth.dto.RegisterRequest;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.services.AuthService;
import com.example.ims.features.auth.stores.RefreshTokenCookieStore;
import com.example.ims.global.response.ApiResponse;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@RequestBody LoginRequest request)
            throws UserNotFoundException {
        AuthResult result = service.loginUser(request);

        ResponseCookie refreshCookie = 
            RefreshTokenCookieStore.store(result.refreshToken(), true);

        return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(ApiResponse.success(
                "안녕하세요, " + result.user().getName() + "님", 
                new AuthResponse(result.user(), result.accessToken())
            ));
    }

    @PostMapping("register")
    public ResponseEntity<ApiResponse<Void>> registerUser(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("안녕하세요, " + request.getName() + "님"));
    }
    
    @GetMapping("refresh")
    public ResponseEntity<ApiResponse<AuthResponse>> reIsssueToken(
    	@CookieValue("refreshToken") String refreshToken
    ) {
    	AuthResult result = service.refresh(refreshToken);
    	
    	ResponseCookie refreshCookie = 
        		RefreshTokenCookieStore.store(result.refreshToken(), true);
    	
    	return ResponseEntity.ok()
            .header(HttpHeaders.SET_COOKIE, refreshCookie.toString())
            .body(ApiResponse.success(
        		null, 
        		new AuthResponse(result.user(), result.accessToken())
        	));
    }
}
