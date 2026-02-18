package com.example.ims.features.notice.services;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.dto.NoticeUpdateRequest;
import com.example.ims.features.notice.exceptions.ExceedPostingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.ims.features.notice.dto.NoticeCreateRequest;
import com.example.ims.features.notice.mapper.NoticeMapper;
import com.example.ims.global.response.ApiResponse;

import jakarta.annotation.Resource;

@Service
public class NoticeEdit {

    @Resource
    NoticeMapper mapper;

    @Value("${ims.upload.notice-dir:uploads/notice}")
    String uploadDir;

    public ApiResponse<Void> execute(Long id, NoticeUpdateRequest req) {
        List<NoticeResponse> pinned = mapper.findPinnedNotices();

        if (!req.oldPinned() && req.pinned()) {
	        if (pinned.size() >= 3)
	        	return ApiResponse.fail("중요 태그가 붙은 게시물의 개수는 3개를 초과할 수 없습니다.");
        }
        String title = req.title() == null ? "" : req.title().trim();
        String content = req.content() == null ? "" : req.content().trim();

        if (title.isBlank() || content.isBlank()) {
            return ApiResponse.fail("게시글 제목 혹은 내용을 입력해주세요.");
        }

        int res = mapper.update(id, title, content, req.pinned());
        if(res == 0) {
        	return ApiResponse.fail("게시글 수정에 실패했습니다.");
        }

        return ApiResponse.success("게시글이 수정되었습니다.");
    }
}
