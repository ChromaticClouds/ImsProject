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
    private final UserRank userRank;
    private final UserRole userRole;

    public AuthPartial(User user) {
        this.eid = user.getEid();
        this.name = user.getName();
        this.email = user.getEmail();
        this.userRank = user.getUserRank();
        this.userRole = user.getUserRole();
    }
}