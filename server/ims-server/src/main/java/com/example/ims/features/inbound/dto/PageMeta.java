package com.example.ims.features.inbound.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PageMeta {
    private int number;          // current page
    private int size;            // page size
    private long totalElements;  // total rows
    private int totalPages;      // total pages
}

