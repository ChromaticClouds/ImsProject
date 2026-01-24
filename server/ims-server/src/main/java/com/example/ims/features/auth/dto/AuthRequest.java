package com.example.ims.features.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class AuthRequest {
    private String eid;
    private String password;
}
