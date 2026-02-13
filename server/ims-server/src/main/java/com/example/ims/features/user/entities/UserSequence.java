package com.example.ims.features.user.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.Year;

@Entity
@Table(name = "user_sequence")
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class UserSequence {

    @Id
    private Integer year;

    @Column(nullable = false)
    private Integer seq = 0;

    public void increase() {
        this.seq++;
    }
}

