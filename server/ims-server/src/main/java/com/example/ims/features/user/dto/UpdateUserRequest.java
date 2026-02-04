package com.example.ims.features.user.dto;

import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;

public record UpdateUserRequest(
    UserRole role,
    UserRank rank,
    UserStatus status
) {}
