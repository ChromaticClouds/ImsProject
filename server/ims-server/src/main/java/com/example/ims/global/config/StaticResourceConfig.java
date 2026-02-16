package com.example.ims.global.config;

import com.example.ims.global.properties.StorageProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Path;

@Configuration
@RequiredArgsConstructor
public class StaticResourceConfig implements WebMvcConfigurer {

    private final StorageProperties props;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String location = Path.of(props.getUploadDir())
            .toAbsolutePath()
            .normalize()
            .toUri()
            .toString();

        registry.addResourceHandler("/upload/**")
            .addResourceLocations(location.endsWith("/") ? location : location + "/");
    }
}
