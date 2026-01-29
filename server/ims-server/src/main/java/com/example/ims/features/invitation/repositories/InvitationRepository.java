package com.example.ims.features.invitation.repositories;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ims.features.auth.entities.User;

public interface InvitationRepository extends JpaRepository<User, Long> {}
