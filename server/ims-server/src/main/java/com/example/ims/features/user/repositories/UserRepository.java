package com.example.ims.features.user.repositories;

import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.example.ims.features.auth.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByStatusNotIn(List<UserStatus> statuses, Pageable pageable);

    Page<User> findByStatusNotInAndNameContainingIgnoreCase(
            List<UserStatus> statuses,
            String name,
            Pageable pageable
    );

    List<User> findByUserRoleIn(List<UserRole> roles);

    List<UserRole> UserRole(UserRole userRole);

    Optional<User> findByEmail(String email);
}
