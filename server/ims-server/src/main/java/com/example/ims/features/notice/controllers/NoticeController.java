package com.example.ims.features.notice.controllers;


import java.io.IOException;
import java.util.List;

import com.example.ims.features.notice.dto.*;
import com.example.ims.features.notice.services.*;
import com.example.ims.features.user.dto.UserPrincipal;
import jakarta.annotation.Resource;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import com.example.ims.global.response.ApiResponse;

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

    @GetMapping("/pinned")
    List<PinnedNoticeSummary> getPinnedNotices() {
        return nList.findPinnedNotices();
    }
    
    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("principal.rank() == 'FIRST_ADMIN' and principal.role() == 'ALL'")
    public ApiResponse<Void> post(
         NoticeCreateRequest notice,
        @AuthenticationPrincipal UserPrincipal user
    ) throws IOException {
       return nCreate.execute(user.userId(), notice);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("principal.rank() == 'FIRST_ADMIN' and principal.role() == 'ALL'")
    public ApiResponse<Void> delete(
        @PathVariable("id") Long id,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return nDelete.execute(id, user.userId());
    }

    @PatchMapping("/{id}/pinned")
    @PreAuthorize("principal.rank() == 'FIRST_ADMIN' and principal.role() == 'ALL'")
    public ApiResponse<Void> pinned(
        @PathVariable("id") Long id,
        @RequestParam boolean pinned
    ) {
        return nPinned.execute(id, pinned);
    }

    @PatchMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("principal.rank() == 'FIRST_ADMIN' and principal.role() == 'ALL'")
    public ApiResponse<Void> patchNotice(
        @PathVariable("id") Long id,
        @RequestPart("notice") NoticeUpdateRequest notice,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return nEdit.execute(id, notice, user.userId());
    }
    
    @PostMapping("file/download")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Object> downloadFile(
		@RequestBody DownloadRequest request
	) throws IOException {
        FileDownloader loader = fileService.downloadFile(request.getFileName());

        if (loader.getRedirectUri() != null) {
            return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(java.util.Map.of(
                    "url", loader.getRedirectUri().toString(),
                    "fileName", loader.getDownloadName()
                ));
        }

        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .header(HttpHeaders.CONTENT_DISPOSITION,
                ContentDisposition.attachment()
                    .filename(loader.getDownloadName(), java.nio.charset.StandardCharsets.UTF_8)
                    .build()
                    .toString())
            .body(loader.getResource());
    }
}
