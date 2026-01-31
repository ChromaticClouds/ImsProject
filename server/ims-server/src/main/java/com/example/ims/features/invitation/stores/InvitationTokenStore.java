package com.example.ims.features.invitation.stores;

import java.time.Duration;
import java.util.Optional;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class InvitationTokenStore {

    private static final String PREFIX = "invite:token:";
    private final StringRedisTemplate redis;

    public void save(String token, String email, Duration ttl) {
        redis.opsForValue().set(PREFIX + token, email, ttl);
    }

    public Optional<String> findEmailByToken(String token) {
        String email = redis.opsForValue().get(PREFIX + token);
        return Optional.ofNullable(email);
    }
}
