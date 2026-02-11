package com.example.ims.features.notice.dto;

public record NoticeActionResponse(
        boolean ok,
        String message,
        NoticeResponse notice
) {}
