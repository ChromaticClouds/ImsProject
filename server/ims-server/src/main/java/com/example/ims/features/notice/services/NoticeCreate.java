package com.example.ims.features.notice.services;

import java.io.IOException;
import java.util.List;

import com.example.ims.features.notice.dto.NoticeResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.example.ims.features.notice.dto.NoticeCreateRequest;
import com.example.ims.features.notice.mapper.NoticeMapper;
import com.example.ims.global.response.ApiResponse;

@Service
@RequiredArgsConstructor
public class NoticeCreate {

    private final FileService fileService;
    private final NoticeMapper mapper;

    @Transactional
    public ApiResponse<Void> execute(Long userId, NoticeCreateRequest req)
            throws IOException {
        List<NoticeResponse> pinned = mapper.findPinnedNotices();

        if(req.isPinned() && pinned.size() >= 3)
            return ApiResponse.fail("중요 태그가 붙은 게시물의 개수는 3개를 초과할 수 없습니다.");

        String title = req.getTitle() == null ? "" : req.getTitle().trim();
        String content = req.getContent() == null ? "" : req.getContent().trim();

        if (title.isBlank() || content.isBlank())
            return ApiResponse.fail("미입력되었습니다");

        List<String> filePaths = new java.util.ArrayList<>();
        try {
            if (req.getAttachments() != null) {
                for (MultipartFile attachment : req.getAttachments()) {
                    String filePath = fileService.saveAttachment(attachment);
                    if (filePath != null) filePaths.add(filePath);
                }
            }

            mapper.insert(userId, title, content, req.isPinned());

            Long noticeId = mapper.lastInsertId();
            for (int index = 0; index < filePaths.size(); index += 1) {
                mapper.insertAttachment(noticeId, filePaths.get(index), index);
            }

            return ApiResponse.success("작성완료");
        } catch (IOException | RuntimeException exception) {
            cleanUpUploadedFiles(filePaths, exception);
            throw exception;
        }
    }

    private void cleanUpUploadedFiles(List<String> filePaths, Exception originalException) {
        try {
            fileService.deleteAttachments(filePaths);
        } catch (IOException cleanupException) {
            originalException.addSuppressed(cleanupException);
        }
    }
}
