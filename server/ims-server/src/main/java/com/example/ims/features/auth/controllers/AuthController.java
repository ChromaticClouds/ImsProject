package com.example.ims.features.auth.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.auth.dto.AuthRequest;
import com.example.ims.features.auth.dto.AuthResponse;
import com.example.ims.features.auth.services.AuthService;
import com.example.ims.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService service;

    @PostMapping("login")
    public ResponseEntity<ApiResponse<AuthResponse>> loginUser(@RequestBody AuthRequest request) {
        AuthResponse response = service.authenticate(request);

        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.success("안녕하세요, " + response.getName() + "님", response));
    }
}
