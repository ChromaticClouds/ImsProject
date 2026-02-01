package com.example.ims.global.config;

import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import com.example.ims.global.properties.ResendProperties;

@Configuration
@EnableConfigurationProperties(ResendProperties.class)
public class ResendConfig {}
