package com.example.ims.features.user.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ims.features.auth.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {}
