package com.example.ims.features.todo.entities;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.example.ims.features.notice.entity.NoticeUser;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
@Table(name = "todo")
public class Todo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private NoticeUser user; // 아까 만든 NoticeUser 재사용

    private String title;
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "start_date")
    private LocalDate startDate;

    @Column(name = "end_date")
    private LocalDate endDate;

    private String tags; // JSON 타입을 문자열로 처리

    @Enumerated(EnumType.STRING)
    private TodoStatus status;

    // 서비스에서 호출하는 상태 변경 메서드
    public void changeStatus(TodoStatus status) {
        this.status = status;
    }
    
    // Todo.java 엔티티 내부
    public void update(TodoRequest req) {
        this.title = req.title();
        this.description = req.description();
        this.startDate = req.startDate();
        this.endDate = req.endDate();
        
        // List<String>을 다시 JSON 문자열로 저장 (Jackson 사용 시)
        // 간단한 구현을 위해 여기선 로직 생략 또는 문자열 결합 처리
        if (req.tags() != null) {
            this.tags = req.tags().toString(); 
        }
    }
}

