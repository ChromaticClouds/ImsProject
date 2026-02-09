package com.example.ims.features.user.dto;

public record PasswordChangeRequest(
    String currentPassword,
    String newPassword,
    String confirmPassword
) {}
