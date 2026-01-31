package com.example.ims.features.invitation.dto;

import com.example.ims.features.auth.entities.User;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class InvitationMailPayload {
    private final User user;
    private final String token;
}
