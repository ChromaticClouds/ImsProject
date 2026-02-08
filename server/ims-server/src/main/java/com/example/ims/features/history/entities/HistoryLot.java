package com.example.ims.features.history.entities;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.history.enums.HistoryStatus;
import jakarta.persistence.*;
import lombok.*;

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
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    HistoryStatus status;

    String memo;
}
