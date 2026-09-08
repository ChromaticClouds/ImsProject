package com.example.ims.global.properties;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Setter
@Getter
@Configuration
@ConfigurationProperties(prefix = "app.storage")
public class StorageProperties {

    private String provider = "local";
    private String uploadDir;
    private Supabase supabase = new Supabase();

    public boolean usesSupabase() {
        return "supabase".equalsIgnoreCase(provider);
    }

    @Setter
    @Getter
    public static class Supabase {
        private String url;
        private String secretKey;
        private String productImageBucket = "ims-product-images";
        private String noticeAttachmentBucket = "ims-notice-attachments";
        private long signedUrlTtlSeconds = 600;
    }
}
