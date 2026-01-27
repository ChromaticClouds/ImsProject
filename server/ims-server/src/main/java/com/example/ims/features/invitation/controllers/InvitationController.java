package com.example.ims.features.invitation.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.invitation.dto.EmailRequest;
import com.example.ims.features.invitation.services.InvitationService;
import com.example.ims.global.response.ApiResponse;
import com.resend.core.exception.ResendException;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/invitation")
@RequiredArgsConstructor
public class InvitationController {

    private final InvitationService service;
    
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> invite(@RequestBody @Valid EmailRequest request) 
        throws ResendException {
        service.invite(request);

        return ResponseEntity.status(HttpStatus.OK)
            .body(ApiResponse.success("초대장 메일이 전송되었습니다."));
    }
    
}
