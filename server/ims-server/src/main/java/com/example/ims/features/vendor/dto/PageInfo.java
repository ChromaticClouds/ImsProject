package com.example.ims.features.vendor.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class PageInfo {
    private int page;
    private int size;
    private int totalPages;
    private long totalElements;
}
