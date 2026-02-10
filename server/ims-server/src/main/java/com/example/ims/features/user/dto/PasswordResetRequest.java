package com.example.ims.features.user.dto;

public record PasswordResetRequest(
    String token,
    String newPassword,
    String confirmPassword
) {}
