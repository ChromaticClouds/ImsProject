package com.example.ims.features.notice.dto;

import lombok.Data;

@Data
public class NoticeCreateRequest {
    Long user_id;
    String title;
    String content;
    boolean pinned;
}
