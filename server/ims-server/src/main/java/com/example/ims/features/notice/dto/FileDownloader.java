package com.example.ims.features.notice.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.core.io.Resource;

import java.net.URI;

@Getter
@AllArgsConstructor
public class FileDownloader {

    private String downloadName;
    private Resource resource;
    private URI redirectUri;

    public static FileDownloader local(String downloadName, Resource resource) {
        return new FileDownloader(downloadName, resource, null);
    }

    public static FileDownloader redirect(String downloadName, URI redirectUri) {
        return new FileDownloader(downloadName, null, redirectUri);
    }
}
