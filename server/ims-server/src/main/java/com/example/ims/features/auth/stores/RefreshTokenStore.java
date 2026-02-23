package com.example.ims.features.auth.stores;

import java.time.Duration;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class RefreshTokenStore {

    private static final String RF_PREFIX = "refresh:";
    private static final String USER_PREFIX = "user-refresh:";
    private static final Duration TTL = Duration.ofDays(14);

    private final StringRedisTemplate redis;

    public void save(String refreshToken, Long userId) {
        String refreshKey = RF_PREFIX + refreshToken;
        String userKey = USER_PREFIX + userId;

        redis.opsForValue().set(refreshKey, userId.toString(), TTL);
        redis.opsForSet().add(userKey, refreshToken);
    }

    public Optional<Long> findUserId(String refreshToken) {
        String key = RF_PREFIX + refreshToken;
        String value = redis.opsForValue().get(key);

        return Optional.ofNullable(value).map(Long::valueOf);
    }

    public void delete(String refreshToken, Long userId) {
        redis.delete("refresh:" + refreshToken);
        redis.opsForSet().remove("user-refresh:" + userId, refreshToken);
    }

    public void deleteAll(Long userId) {
        String userKey = "user-refresh:" + userId;

        Set<String> tokens = redis.opsForSet().members(userKey);
        if (tokens != null) {
            tokens.forEach(token -> redis.delete("refresh:" + token));
        }

        redis.delete(userKey);
    }

}
