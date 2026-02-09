package com.example.ims.features.user.stores;

import com.example.ims.features.user.dto.PasswordChangePayload;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import java.time.Duration;

@Component
@RequiredArgsConstructor
public class PasswordResetTokenStore {

    private static final String PREFIX = "auth:password-reset:";

    private final StringRedisTemplate redis;

    public void save(PasswordChangePayload payload, Duration ttl) {
        redis.opsForValue().set(PREFIX + payload.token(), payload.email(), ttl);
    }
}
