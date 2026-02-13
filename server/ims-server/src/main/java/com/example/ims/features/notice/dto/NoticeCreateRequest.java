package com.example.ims.features.notice.dto;

import lombok.Data;

import org.springframework.web.multipart.MultipartFile;



@Data
public class NoticeCreateRequest {
    Long user_id;
    String title;
    String content;
    boolean pinned;
    MultipartFile upff;
}


