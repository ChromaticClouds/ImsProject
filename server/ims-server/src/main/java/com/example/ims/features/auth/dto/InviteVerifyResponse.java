package com.example.ims.features.auth.dto;

import com.example.ims.features.auth.enums.UserStatus;
public record InviteVerifyResponse(
    UserStatus status,
    String email
) {}
