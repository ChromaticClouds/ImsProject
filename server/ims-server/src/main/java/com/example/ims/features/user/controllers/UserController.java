package com.example.ims.features.user.controllers;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.user.dto.UserPrincipal;
import com.example.ims.features.user.services.UserService;
import com.example.ims.global.dto.PageResponse;
import com.example.ims.global.response.ApiResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
public class UserController {

    private static final int PAGE_SIZE = 10;

    private final UserService service;

    @GetMapping("permission")
    public ResponseEntity<ApiResponse<UserRole>> getUserRole(
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        UserRole role = UserRole.valueOf(principal.role());
        return ResponseEntity.ok(ApiResponse.success(role));
    }

    @GetMapping("list")
    public ResponseEntity<ApiResponse<PageResponse<User>>> getUserList(
        @RequestParam(value = "page", defaultValue = "1") Integer page
    ) {
        Pageable pageable = PageRequest.of(page - 1, PAGE_SIZE);
        PageResponse<User> userList = service.getUserList(pageable);

        return ResponseEntity.ok(ApiResponse.success(userList));
    }
}
