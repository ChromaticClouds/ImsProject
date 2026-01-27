package com.example.ims.features.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Getter
@ToString
@NoArgsConstructor
public class RegisterRequest {
    private String name;
    private String password;
    private String confirmPassword;
}
