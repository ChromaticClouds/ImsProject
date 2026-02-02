package com.example.ims.features.auth.dto;

public record AuthResponse(
    AuthPartial user,
    String token
) {}
