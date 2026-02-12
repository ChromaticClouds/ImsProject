package com.example.ims.features.notice.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "user") // 실제 DB 테이블 명은 user
@Getter
@NoArgsConstructor
public class NoticeUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String eid;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING) // Enum의 문자열 이름을 DB에 저장
    private UserRank userRank;

    @Enumerated(EnumType.STRING)
    private UserRole userRole;

    @Enumerated(EnumType.STRING)
    private UserStatus status;
}

// --- Enum 클래스들 ---

enum UserRank {
    FIRST_ADMIN, SECOND_ADMIN, EMPLOYEE
}

enum UserRole {
    NONE, PLACE_ORDER, INBOUND, RECEIVE_ORDER, OUTBOUND, ALL
}

enum UserStatus {
    PENDING, ACTIVE, INACTIVE, DELETED
}