package com.example.ims.features.adjust.controllers;

import com.example.ims.features.adjust.dto.AdjustRequest;
import com.example.ims.features.adjust.services.AdjustService;
import com.example.ims.features.user.dto.UserPrincipal;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/adjust")
@RequiredArgsConstructor
public class AdjustController {

    private final AdjustService service;

    @PostMapping
    public ResponseEntity<ApiResponse<Void>> adjustProducts(
        @RequestBody AdjustRequest request,
        @AuthenticationPrincipal UserPrincipal principal
    ) {
        Long userId = principal.userId();
        service.adjustProducts(userId, request);

        return ResponseEntity.ok(ApiResponse.success("성공적으로 조정이 완료됐습니다."));
    }
}
