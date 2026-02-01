package com.example.ims.features.auth.dto;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.entities.UserRank;
import com.example.ims.features.auth.entities.UserRole;

import lombok.Getter;

@Getter
public class AuthResponse {
    private final String eid;
    private final String name;
    private final String email;
    private final UserRank rank;
    private final UserRole role;
    private final String token;

    public AuthResponse(User user, String token) {
        this.eid = user.getEid();
        this.name = user.getName();
        this.email = user.getEmail();
        this.rank = user.getUserRank();
        this.role = user.getUserRole();
        this.token = token;
    }
}