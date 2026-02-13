package com.example.ims.features.user.dto;

import com.example.ims.features.auth.entities.User;

public record UserIdentifier(
    Long id,
    String name
) {
    public static UserIdentifier from(User user) {
        return new UserIdentifier(user.getId(), user.getName());
    }
}
