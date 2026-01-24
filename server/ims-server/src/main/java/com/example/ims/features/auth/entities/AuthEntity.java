package com.example.ims.features.auth.entities;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@NoArgsConstructor
public class AuthEntity {

    @Id
    private Long id;

    private String eid;
    private String name;
    private String email;
    private String password;
    private AuthRank rank;
    private AuthRole role;
}
