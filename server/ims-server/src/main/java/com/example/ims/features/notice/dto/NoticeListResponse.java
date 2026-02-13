package com.example.ims.features.notice.dto;

import java.util.List;

public record NoticeListResponse(
    List<NoticeResponse> pinned,
    List<NoticeResponse> items,
    int page,
    int totalPages,
    long totalElements
) {}
