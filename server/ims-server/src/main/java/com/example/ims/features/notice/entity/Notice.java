package com.example.ims.features.notice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import java.time.LocalDate;

@Getter
@Entity
@Table(name = "notice")
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 1. 단순 Long userId 대신 NoticeUser 엔티티를 직접 참조
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private NoticeUser user;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = false)
    private boolean pinned; // DB: BIT(1)

    @Column(name = "created_at", nullable = false)
    private LocalDate createdAt; // DB: DATE

    protected Notice() {} // JPA 필수

    // 2. 등록용 생성자 수정: Long userId -> NoticeUser user
    public Notice(NoticeUser user, String title, String content, boolean pinned, LocalDate createdAt) {
        this.user = user;
        this.title = title;
        this.content = content;
        this.pinned = pinned;
        this.createdAt = createdAt;
    }

    // 3. 수정용 메서드 (작성자 변경이 필요 없다면 user는 제외)
    public void update(String title, String content, boolean pinned) {
        this.title = title;
        this.content = content;
        this.pinned = pinned;
    }
}
