package com.example.ims.features.history.entities;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.history.enums.HistoryStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "history_lot")
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HistoryLot {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "order_number", length = 255)
    private String orderNumber;

    @Enumerated(EnumType.STRING)
    HistoryStatus status;

    String memo;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    void initializeCreatedAt() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
    }
}
