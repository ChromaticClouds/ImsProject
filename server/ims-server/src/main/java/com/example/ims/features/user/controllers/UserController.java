package com.example.ims.features.user.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.auth.entities.UserRole;
import com.example.ims.features.user.dto.UserPrincipal;
import com.example.ims.global.response.ApiResponse;

@RestController
@RequestMapping("/user")
public class UserController {

    @GetMapping("permission")
    public ResponseEntity<ApiResponse<UserRole>> getUserRole(
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        UserRole role = UserRole.valueOf(principal.role());
        return ResponseEntity.ok(ApiResponse.success(role));
    }
}
