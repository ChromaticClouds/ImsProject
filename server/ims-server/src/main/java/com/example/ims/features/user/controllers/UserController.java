package com.example.ims.features.user.controllers;

import com.example.ims.features.auth.stores.RefreshTokenCookieStore;
import com.example.ims.features.user.dto.*;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRole;
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
    public ResponseEntity<ApiResponse<PageResponse<UserListResponse>>> getUserList(
        @RequestParam(value = "page", defaultValue = "1") Integer page,
        @RequestParam(value = "search", defaultValue = "") String search
    ) {
        Pageable pageable = PageRequest.of(page - 1, PAGE_SIZE);
        PageResponse<UserListResponse> userList = service.getUserList(pageable, search);

        return ResponseEntity.ok(ApiResponse.success(userList));
    }

    @PatchMapping("permission/{id}")
    public ResponseEntity<ApiResponse<Void>> patchUserPermission(
        @PathVariable("id") Long id,
        @RequestBody UpdateUserRequest request
    ) {
        service.updateUser(id, request);

        return ResponseEntity.ok(ApiResponse.success("권한 변경 성공"));
    }

    @PatchMapping("change-password")
    public ResponseEntity<ApiResponse<Void>> patchUserPassword(
        @RequestBody PasswordChangeRequest request,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        service.changePassword(user.userId(), request);
        return ResponseEntity.ok(ApiResponse.success("비밀번호가 변경되었습니다."));
    }

    @PostMapping("logout")
    public ResponseEntity<ApiResponse<Void>> logoutUser(
            @AuthenticationPrincipal UserPrincipal user
    ) {
        service.logoutUser(user.userId());

        ResponseCookie deleteCookie =
                RefreshTokenCookieStore.delete(false);

        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, deleteCookie.toString())
                .body(ApiResponse.success("로그아웃 되었습니다."));
    }

    @PostMapping("forgot-password")
    public ResponseEntity<ApiResponse<Void>> postEmail(
        @RequestBody EmailRequest request
    ) {
        service.sendEmail(request);
        return ResponseEntity.ok(ApiResponse.success("Got email"));
    }
}
