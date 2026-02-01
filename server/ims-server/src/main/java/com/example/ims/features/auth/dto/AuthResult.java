package com.example.ims.features.auth.dto;

import com.example.ims.features.auth.entities.User;

public record AuthResult(
    User user,
    String accessToken,
    String refreshToken
) {}
