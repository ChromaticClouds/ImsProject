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

    public ApiResponse<Void> execute(Long userId, NoticeCreateRequest req) {
    	
    	System.out.println("NoticeCreate : "+req);
        List<NoticeResponse> pinned = mapper.findPinnedNotices();

        if(req.isPinned()) {
        	if (pinned.size() >= 3)
        		return ApiResponse.fail("중요 태그가 붙은 게시물의 개수는 3개를 초과할 수 없습니다.");

        }
        
        String title = req.getTitle() == null ? "" : req.getTitle().trim();
        String content = req.getContent() == null ? "" : req.getContent().trim();

        if (title.isBlank() || content.isBlank()) {
            return ApiResponse.fail("미입력되었습니다");
        }

        String filePath = null; // DB에 넣을 file_name 값(=경로)
        
        MultipartFile file = req.getUpff();
        
        uploadDir = "C:\\Users\\andbe\\OneDrive\\Desktop\\ims_prj\\ImsProject\\server\\ims-server\\src\\main\\resources\\static\\uploads";

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

        mapper.insert(userId, title, content, req.isPinned(), filePath);
        return ApiResponse.success("작성완료");
    }
}
