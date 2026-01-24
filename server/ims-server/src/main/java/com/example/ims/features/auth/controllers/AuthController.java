package com.example.ims.features.auth.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.auth.dto.AuthRequest;
import com.example.ims.global.response.ApiResponse;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @PostMapping("login")
    public ResponseEntity<ApiResponse<Void>> loginUser(@RequestBody AuthRequest request) {
        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.success("Login Request Received"));
    }
}
