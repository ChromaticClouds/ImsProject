package com.example.ims.features.notice.dto;

import java.util.List;

public record PinnedNoticeSummary(
    Long id,
    String title,
    NoticeResponse.NoticeAuthor author
) {
    public static PinnedNoticeSummary from(NoticeResponse notice) {
        return new PinnedNoticeSummary(
            notice.id(),
            notice.title(),
            notice.author()
        );
    }
}
