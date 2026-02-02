package com.example.ims.features.auth.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class PasswordRequest {
    
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
