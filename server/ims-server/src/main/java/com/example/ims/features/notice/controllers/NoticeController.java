package com.example.ims.features.notice.controllers;

import java.util.List;

import com.example.ims.features.notice.dto.NoticeListResponse;
import com.example.ims.features.user.dto.UserPrincipal;
import org.springframework.http.MediaType;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.example.ims.features.notice.dto.NoticeCreateRequest;
import com.example.ims.features.notice.dto.NoticeResponse;
import com.example.ims.features.notice.services.NoticeCreate;
import com.example.ims.features.notice.services.NoticeDelete;
import com.example.ims.features.notice.services.NoticeDetail;
import com.example.ims.features.notice.services.NoticeList;
import com.example.ims.features.notice.services.NoticePinnedUpdate;
import com.example.ims.global.response.ApiResponse;

import jakarta.annotation.Resource;

@RestController
@RequestMapping("/api/notice")
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
    NoticePinnedUpdate nPinned;

    // GetMapping 부분
    @GetMapping("/list")
    public NoticeListResponse getNotices(
        @RequestParam(value = "page", defaultValue = "1") Integer page,
        @RequestParam(value = "search", required = false) String search
    ) {
        return nList.execute(page);
    }

    @GetMapping("/{id}")
    NoticeResponse detail(@PathVariable Long id) {
        return nDetail.execute(id);
    }

    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> post(
        @RequestPart("notice") NoticeCreateRequest notice,
        @RequestPart(value = "file", required = false) MultipartFile file,
        @AuthenticationPrincipal UserPrincipal user
    ) {
        return nCreate.execute(user.userId(), notice, file);
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@PathVariable Long id) {
        return nDelete.execute(id);
    }

    @PatchMapping("/{id}/pinned")
    public ApiResponse<Void> pinned(@PathVariable Long id, @RequestParam boolean pinned) {
        return nPinned.execute(id, pinned);
    }
}
