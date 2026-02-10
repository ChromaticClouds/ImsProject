package com.example.ims.features.notice.services;

import org.springframework.stereotype.Service;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.mapper.NoticeMapper;

import jakarta.annotation.Resource;

@Service
public class NoticeDetail {
    @Resource
    NoticeMapper mapper;

    public NoticeResponse execute(Long id) {
        NoticeResponse notice = mapper.findById(id);
        if (notice == null) throw new IllegalArgumentException("공지 없음 id=" + id);
        return notice;
    }
}
