package com.example.ims.features.user.dto;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class UserListResponse {

    private Long id;
    private String eid;
    private String name;
    private String email;
    private UserRank userRank;
    private UserRole userRole;
    private UserStatus status;

    public static UserListResponse from(User user) {
        return UserListResponse.builder()
            .id(user.getId())
            .eid(user.getEid())
            .name(user.getName())
            .email(user.getEmail())
            .userRank(user.getUserRank())
            .userRole(user.getUserRole())
            .status(user.getStatus())
            .build();
    }
}
