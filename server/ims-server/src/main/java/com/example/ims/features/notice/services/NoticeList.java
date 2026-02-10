package com.example.ims.features.notice.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.mapper.NoticeMapper;

import jakarta.annotation.Resource;

@Service
public class NoticeList {
    @Resource
    NoticeMapper mapper;

    public List<NoticeResponse> execute() {
        return mapper.list();
    }
}
