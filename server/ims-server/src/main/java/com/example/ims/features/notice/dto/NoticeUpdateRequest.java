package com.example.ims.features.notice.dto;

import jakarta.validation.constraints.NotBlank;

public record NoticeUpdateRequest(
    @NotBlank String title,
    @NotBlank String content,
    boolean pinned,
    boolean oldPinned,
    String fileName
) {}
