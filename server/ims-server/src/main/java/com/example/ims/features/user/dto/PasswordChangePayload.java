package com.example.ims.features.user.dto;

public record PasswordChangePayload(
    String email,
    String token
) {}
