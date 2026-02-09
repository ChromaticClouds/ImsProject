package com.example.ims.features.user.stores;

import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class EmailTokenStore {

    private final StringRedisTemplate redis;
}
