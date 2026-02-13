package com.example.ims.features.inbound.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageResponse<T> {
    private List<T> content;
    private PageMeta page;

    public static <T> PageResponse<T> of(List<T> content, int page, int size, long total) {
        int totalPages = (int) Math.ceil((double) total / (double) size);
        return PageResponse.<T>builder()
                .content(content)
                .page(PageMeta.builder()
                    .number(page)
                    .size(size)
                    .totalElements(total)
                    .totalPages(totalPages)
                    .build())
                .build();
    }
}