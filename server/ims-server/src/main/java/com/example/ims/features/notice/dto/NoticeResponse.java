package com.example.ims.features.notice.dto;

import lombok.Data;

@Data
public class NoticeResponse {
    Long id;
    Long user_id;
    String title;
    String content;
    boolean pinned;
    String created_at;
    String file_name; // 파일 경로
}
