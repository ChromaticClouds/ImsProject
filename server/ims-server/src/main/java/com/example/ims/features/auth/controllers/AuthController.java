package com.example.ims.features.auth.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.auth.dto.AuthResponse;
import com.example.ims.features.auth.dto.InviteVerifyResponse;
import com.example.ims.features.auth.dto.LoginRequest;
import com.example.ims.features.auth.dto.RegisterRequest;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.auth.services.AuthService;
import com.example.ims.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@RequestBody LoginRequest request)
            throws UserNotFoundException {
        AuthResponse response = service.loginUser(request);

        return ResponseEntity.status(HttpStatus.OK)
                .body(ApiResponse.success("안녕하세요, " + response.getName() + "님", response));
    }

    @PostMapping("register")
    public ResponseEntity<ApiResponse<Void>> registerUser(@RequestBody RegisterRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("안녕하세요, " + request.getName() + "님"));
    }

    @GetMapping("token")
    public ResponseEntity<ApiResponse<InviteVerifyResponse>> verifyToken(
            @RequestParam("token") String token) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.success(service.verifyInviteToken(token)));
    }
}
