package com.example.ims.features.notice.dto;

import com.example.ims.features.notice.entity.Notice;
import java.time.LocalDate;
import java.util.List;

public record NoticeResponse(
        Long id,
        Long userId,
        String userName,
        String title,
        String content,
        boolean pinned,
        LocalDate createdAt,
        List<String> attachments,
        NoticeAuthor author,
        NoticeSummary previousNotice,
        NoticeSummary nextNotice
) {
    public record NoticeAuthor(
            Long id,
            String name,
            String eid,
            String email
    ) {}

    public record NoticeSummary(
            Long id,
            String title
    ) {}

    public NoticeResponse(
            Long id,
            Long userId,
            String userName,
            String title,
            String content,
            boolean pinned,
            LocalDate createdAt
    ) {
        this(
                id,
                userId,
                userName,
                title,
                content,
                pinned,
                createdAt,
                List.of(),
                new NoticeAuthor(userId, userName, null, null),
                null,
                null
        );
    }

    public static NoticeResponse from(Notice n) {
        return new NoticeResponse(
                n.getId(),
                n.getUser().getId(),
                n.getUser().getName(),
                n.getTitle(),
                n.getContent(),
                n.isPinned(),
                n.getCreatedAt()
        );
    }

    public NoticeResponse withAttachments(List<String> attachments) {
        return new NoticeResponse(
                id,
                userId,
                userName,
                title,
                content,
                pinned,
                createdAt,
                attachments == null ? List.of() : attachments,
                author,
                previousNotice,
                nextNotice
        );
    }

    public NoticeResponse withDetailMeta(
            NoticeAuthor author,
            NoticeSummary previousNotice,
            NoticeSummary nextNotice
    ) {
        return new NoticeResponse(
                id,
                userId,
                userName,
                title,
                content,
                pinned,
                createdAt,
                attachments,
                author == null ? this.author : author,
                previousNotice,
                nextNotice
        );
    }
}
