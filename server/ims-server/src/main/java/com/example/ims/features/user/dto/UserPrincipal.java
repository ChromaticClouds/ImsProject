package com.example.ims.features.user.dto;

public record UserPrincipal(
    Long userId,
    String email,
    String role,
    String rank
) {}
