package com.example.ims.features.notice.services;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.exceptions.NoticeAuthException;
import org.springframework.stereotype.Service;

import com.example.ims.features.notice.mapper.NoticeMapper;
import com.example.ims.global.response.ApiResponse;

import jakarta.annotation.Resource;

@Service
public class NoticeDelete {

    @Resource
    NoticeMapper mapper;

    public ApiResponse<Void> execute(Long id, Long userId) {
        NoticeResponse.NoticeAuthor author = mapper.findAuthorByNoticeId(id);
        if (author == null || !author.id().equals(userId))
            throw new NoticeAuthException();

        int affected = mapper.delete(id);
        if (affected == 0) return ApiResponse.fail("게시글이 없습니다");
        return ApiResponse.success("삭제 완료 되었습니다.");
    }
}
