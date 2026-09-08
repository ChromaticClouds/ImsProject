package com.example.ims.features.notice.services;

import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.exceptions.NoticeAuthException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import com.example.ims.features.notice.mapper.NoticeMapper;
import com.example.ims.global.response.ApiResponse;

import java.io.IOException;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class NoticeDelete {

    private final NoticeMapper mapper;
    private final FileService fileService;

    public ApiResponse<Void> execute(Long id, Long userId) {
        NoticeResponse.NoticeAuthor author = mapper.findAuthorByNoticeId(id);
        if (author == null || !author.id().equals(userId))
            throw new NoticeAuthException();

        List<String> attachmentPaths = mapper.findAttachmentFileNames(id);
        int affected = mapper.delete(id);
        if (affected == 0) return ApiResponse.fail("게시글이 없습니다");

        try {
            fileService.deleteAttachments(attachmentPaths);
        } catch (IOException exception) {
            log.warn("공지 {} 삭제 후 첨부파일 정리에 실패했습니다.", id, exception);
        }
        return ApiResponse.success("삭제 완료 되었습니다.");
    }
}
