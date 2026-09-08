package com.example.ims.global.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.AssertTrue;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@Configuration
@ConfigurationProperties(prefix = "app.auth.cookie")
public class AuthCookieProperties {

    private boolean secure = true;

    @NotBlank
    @Pattern(regexp = "Strict|Lax|None")
    private String sameSite = "Lax";

    @AssertTrue(message = "SameSite=None requires a secure cookie")
    public boolean isSameSiteConfigurationValid() {
        return secure || !"None".equalsIgnoreCase(sameSite);
    }
}
