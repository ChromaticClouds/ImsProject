package com.example.ims.global.properties;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Validated
@Configuration
@ConfigurationProperties(prefix = "app.client")
public class ClientProperties {

    @NotBlank(message = "CLIENT_BASE_URL이 설정되지 않았습니다.")
    private String baseUrl;
}
