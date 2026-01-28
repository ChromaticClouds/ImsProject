package com.example.ims.global.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ConfigurationProperties(prefix = "resend")
@Validated
public class ResendProperties {

    @NotBlank(message = "RESEND_API_KEY가 설정되지 않았습니다.")
    private String apiKey;
}
