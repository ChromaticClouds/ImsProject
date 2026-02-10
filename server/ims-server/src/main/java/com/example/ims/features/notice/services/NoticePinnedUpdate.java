package com.example.ims.features.notice.services;

import org.springframework.stereotype.Service;

import com.example.ims.features.notice.mapper.NoticeMapper;
import com.example.ims.global.response.ApiResponse;

import jakarta.annotation.Resource;

@Service
public class NoticePinnedUpdate {

    @Resource
    NoticeMapper mapper;

    public ApiResponse<Void> execute(Long id, boolean pinned) {
        int affected = mapper.updatePinned(id, pinned);
        if (affected == 0) return ApiResponse.fail("게시글이 없습니다");
        return ApiResponse.success("변경되었습니다");
    }
}
