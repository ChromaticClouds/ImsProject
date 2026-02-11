package com.example.ims.features.notice.dto;

import lombok.Data;
import com.example.ims.features.notice.entity.Notice;
import java.time.LocalDate;

//@Data
//public class NoticeResponse {
//    Long id;
//    Long user_id;
//    String title;
//    String content;
//    boolean pinned;
//    String created_at;
//    String file_name; // 파일 경로
//}


public record NoticeResponse(
        Long id,
        Long userId,
        String title,
        String content,
        boolean pinned,
        LocalDate createdAt,
        String fileName
) {
    public static NoticeResponse from(Notice n) {
        return new NoticeResponse(
                n.getId(),
                n.getUserId(),
                n.getTitle(),
                n.getContent(),
                n.isPinned(),
                n.getCreatedAt(),
                n.getFileName()
        );
    }
}
