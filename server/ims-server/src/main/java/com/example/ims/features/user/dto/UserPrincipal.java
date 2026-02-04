package com.example.ims.features.user.dto;

/**
 * 유저의 권한을 확인할 수 있는 JWT 페이로드 DTO
 * @param userId
 * @param email
 * @param role
 * @param rank
 */
public record UserPrincipal(
    Long userId,
    String email,
    String role,
    String rank
) {}
