package com.example.ims.features.notice.controllers;

import java.util.List;

import org.springframework.http.MediaType;
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
    List<NoticeResponse> list() {
        return nList.execute();
    }

    @GetMapping("/{id}")
    NoticeResponse detail(NoticeResponse dto) {
        return nDetail.execute(dto.getId());
    }

    @PostMapping(value = "/post", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ApiResponse<Void> post(
            @RequestPart("notice") NoticeCreateRequest notice,
            @RequestPart(value = "file", required = false) MultipartFile file
    ) {
        return nCreate.execute(notice, file);
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
