package com.example.ims.features.notice.dto;

import lombok.Data;
import com.example.ims.features.notice.entity.Notice;
import java.time.LocalDate;


public record NoticeResponse(
        Long id,
        Long userId,
        String userName,
        String title,
        String content,
        boolean pinned,
        LocalDate createdAt,
        String fileName
) {
    public static NoticeResponse from(Notice n) {
        return new NoticeResponse(
                n.getId(),
                n.getUser().getId(),
                n.getUser().getName(),
                n.getTitle(),
                n.getContent(),
                n.isPinned(),
                n.getCreatedAt(),
                n.getFileName()
        );
    }
}
