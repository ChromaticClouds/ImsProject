package com.example.ims.features.notice.services;

import java.util.List;

import com.example.ims.features.notice.dto.NoticeListResponse;
import org.springframework.stereotype.Service;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.mapper.NoticeMapper;

import jakarta.annotation.Resource;
import org.springframework.web.bind.annotation.RequestParam;

@Service
public class NoticeList {

    private static final Integer SIZE = 10;

    @Resource
    NoticeMapper mapper;

    public NoticeListResponse execute(Integer page) {
        int offset = (page - 1) * SIZE;

        List<NoticeResponse> pinned = mapper.findPinnedNotices();
        List<NoticeResponse> items = mapper.list(SIZE, offset);
        long totalElements = mapper.countNormal();
        int totalPages = (int) Math.ceil((double) totalElements / SIZE);

        return new NoticeListResponse(pinned, items, page, totalPages, totalElements);
    }
}
