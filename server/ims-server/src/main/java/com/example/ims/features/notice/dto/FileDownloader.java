package com.example.ims.features.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.core.io.Resource;

@Setter
@Getter
@AllArgsConstructor
public class FileDownloader {
    private String downloadName;
    private String encoded;
    private Resource resource;
}
