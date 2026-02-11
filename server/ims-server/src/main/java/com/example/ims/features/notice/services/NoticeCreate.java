package com.example.ims.features.notice.services;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.exceptions.ExceedPostingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.ims.features.notice.dto.NoticeCreateRequest;
import com.example.ims.features.notice.mapper.NoticeMapper;
import com.example.ims.global.response.ApiResponse;

import jakarta.annotation.Resource;

@Service
public class NoticeCreate {

    @Resource
    NoticeMapper mapper;

    @Value("${ims.upload.notice-dir:uploads/notice}")
    String uploadDir;

    public ApiResponse<Void> execute(Long userId, NoticeCreateRequest req, MultipartFile file) {
        List<NoticeResponse> pinned = mapper.findPinnedNotices();

        if (pinned.size() >= 3)
            throw new ExceedPostingException();

        String title = req.title() == null ? "" : req.title().trim();
        String content = req.content() == null ? "" : req.content().trim();

        if (title.isBlank() || content.isBlank()) {
            return ApiResponse.fail("미입력되었습니다");
        }

        String filePath = null; // DB에 넣을 file_name 값(=경로)

        if (file != null && !file.isEmpty()) {
            try {
                Files.createDirectories(Paths.get(uploadDir));

                String original = file.getOriginalFilename();
                String ext = (original != null && original.contains("."))
                        ? original.substring(original.lastIndexOf('.'))
                        : "";

                String savedName = UUID.randomUUID() + ext;
                Path savePath = Paths.get(uploadDir).resolve(savedName);

                file.transferTo(savePath.toFile());

                // DB에는 "경로"만 저장 (요구사항: file_name = 경로)
                filePath = savePath.toString().replace("\\", "/");
            } catch (IOException e) {
                throw new RuntimeException("파일 저장 실패", e);
            }
        }

        mapper.insert(userId, title, content, req.pinned(), filePath);
        return ApiResponse.success("작성완료");
    }
}
