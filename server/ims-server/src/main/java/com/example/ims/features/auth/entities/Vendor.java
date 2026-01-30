package com.example.ims.features.auth.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "vendor")
@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vendor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Supplier / Seller
    @Column(nullable = false, length = 20)
    private String type;

    @Column(nullable = false)
    private String vendorName;

    private String telephone;
    private String email;
    private String bossName;
    private String address;

    @Column(columnDefinition = "TEXT")
    private String memo;

    private String imageUrl;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
    }
}
