package com.example.ims.features.auth.repositories;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ims.features.auth.entities.User;

public interface AuthRepository extends JpaRepository<User, Long> {

    Optional<User> findByEid(String eid);
    Optional<User> findByEmail(String email);
}
