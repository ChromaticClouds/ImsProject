package com.example.ims.features.notice.dto;

import lombok.Data;

import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;


@Data
public class NoticeCreateRequest {
    Long user_id;
    String title;
    String content;
    boolean pinned;
    List<MultipartFile> attachments = new ArrayList<>();
}


