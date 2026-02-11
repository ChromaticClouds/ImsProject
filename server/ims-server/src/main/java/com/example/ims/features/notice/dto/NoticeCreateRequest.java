package com.example.ims.features.notice.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

//@Data
//public class NoticeCreateRequest {
//    Long user_id;
//    String title;
//    String content;
//    boolean pinned;
//}


public record NoticeCreateRequest(
    @NotBlank String title,
    @NotBlank String content,
    boolean pinned
) {}
