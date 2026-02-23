package com.example.ims.features.notice.controllers;


import java.io.IOException;

import com.example.ims.features.notice.dto.*;
import com.example.ims.features.notice.services.*;
import com.example.ims.features.user.dto.UserPrincipal;
import com.example.ims.global.properties.StorageProperties;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.ims.global.response.ApiResponse;

import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/notice")
@RequiredArgsConstructor
public class NoticeController {

    @Resource
    NoticeList nList;

    @Resource
    NoticeDetail nDetail;

    @Resource
    NoticeCreate nCreate;

    @Resource
    NoticeDelete nDelete;
    
    @Resource
    NoticeEdit nEdit;

    @Resource
    NoticePinnedUpdate nPinned;

    private final StorageProperties props;
    private final FileService fileService;

    // GetMapping 부분
    @GetMapping("/list")
    public NoticeListResponse getNotices(
        @RequestParam(value = "page", defaultValue = "1") Integer page,
        @RequestParam(value = "search", required = false) String search
    ) {
        return nList.execute(page, search);
    }

    @GetMapping("/{id}")
    NoticeResponse detail(@PathVariable("id") Long id) {
        return nDetail.execute(id);
    }

    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> post(
         NoticeCreateRequest notice,
        @AuthenticationPrincipal UserPrincipal user
    ) throws IOException {
       return nCreate.execute(user.userId(), notice);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable("id") Long id) {
        return nDelete.execute(id);
    }

    @PatchMapping("/{id}/pinned")
    public ApiResponse<Void> pinned(@PathVariable("id") Long id, @RequestParam boolean pinned) {
        return nPinned.execute(id, pinned);
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> patchNotice(
        @PathVariable("id") Long id,
        @RequestPart("notice") NoticeUpdateRequest notice
    ) {
        return nEdit.execute(id, notice);
    }
    
    @PostMapping("file/download")
    public ResponseEntity<Object> downloadFile(
		@RequestBody DownloadRequest request
	) throws IOException {
        FileDownloader loader = fileService.downloadFile(request.getFileName());
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION,
    "attachment; filename=\"" + sanitizeAscii(loader.getDownloadName()
                + "\"; filename*=UTF-8''" + loader.getEncoded()))
            .body(loader.getResource());
    }

    private String sanitizeAscii(String filename) {
        // header에 들어갈 기본 filename은 ASCII 위주로 간단 정리(브라우저 호환)
        return filename.replaceAll("[\\\\\\r\\n\"]", "_");
    }
}
