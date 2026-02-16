package com.example.ims.features.notice.services;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.exceptions.ExceedPostingException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.ims.features.notice.dto.NoticeCreateRequest;
import com.example.ims.features.notice.mapper.NoticeMapper;
import com.example.ims.global.response.ApiResponse;

import jakarta.annotation.Resource;

@Service
@RequiredArgsConstructor
public class NoticeCreate {

    private final FileService fileService;
    private final NoticeMapper mapper;

    @Value("${ims.upload.notice-dir:uploads/notice}")
    String uploadDir;

    public ApiResponse<Void> execute(Long userId, NoticeCreateRequest req)
            throws IOException {
        List<NoticeResponse> pinned = mapper.findPinnedNotices();

        if(req.isPinned() && pinned.size() >= 3)
            return ApiResponse.fail("중요 태그가 붙은 게시물의 개수는 3개를 초과할 수 없습니다.");

        String title = req.getTitle() == null ? "" : req.getTitle().trim();
        String content = req.getContent() == null ? "" : req.getContent().trim();

        if (title.isBlank() || content.isBlank())
            return ApiResponse.fail("미입력되었습니다");

        String filePath = fileService.saveToUploads(req.getUpff());

        mapper.insert(userId, title, content, req.isPinned(), filePath);
        return ApiResponse.success("작성완료");
    }
}
