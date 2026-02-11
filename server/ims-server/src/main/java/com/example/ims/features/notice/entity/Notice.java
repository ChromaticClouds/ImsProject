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

    @Column(name="user_id", nullable=false)
    private Long userId;

    @Column(nullable=false)
    private String title;

    @Column(columnDefinition="TEXT", nullable=false)
    private String content;

    @Column(nullable=false)
    private boolean pinned; // DB: BIT(1)

    @Column(name="created_at", nullable=false)
    private LocalDate createdAt; // DB: DATE

    @Column(name="file_name")
    private String fileName;

    protected Notice() {} // JPA 필수

    // 등록용 생성자
    public Notice(Long userId, String title, String content, boolean pinned, LocalDate createdAt, String fileName) {
        this.userId = userId;
        this.title = title;
        this.content = content;
        this.pinned = pinned;
        this.createdAt = createdAt;
        this.fileName = fileName;
    }

    // 수정용 메서드
    public void update(String title, String content, boolean pinned, String fileName) {
        this.title = title;
        this.content = content;
        this.pinned = pinned;
        this.fileName = fileName;
    }

}
