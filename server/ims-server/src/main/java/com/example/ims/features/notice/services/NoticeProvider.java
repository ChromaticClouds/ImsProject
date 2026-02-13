package com.example.ims.features.notice.services;

import lombok.Getter;
import org.jspecify.annotations.NonNull;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.stereotype.Service;

@Getter
@Service
public class NoticeProvider implements ApplicationContextAware {

    private ApplicationContext context;

    @Override
    public void setApplicationContext(@NonNull ApplicationContext applicationContext) {
        this.context = applicationContext;
    }

}
