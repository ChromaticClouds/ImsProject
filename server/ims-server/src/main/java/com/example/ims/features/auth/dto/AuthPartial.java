package com.example.ims.features.auth.dto;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRank;
import com.example.ims.features.auth.enums.UserRole;

import lombok.Getter;

@Getter
public class AuthPartial {
    private final String eid;
    private final String name;
    private final String email;
    private final UserRank rank;
    private final UserRole role;

    public AuthPartial(User user) {
        this.eid = user.getEid();
        this.name = user.getName();
        this.email = user.getEmail();
        this.rank = user.getUserRank();
        this.role = user.getUserRole();
    }
}