package com.example.ims.features.user.repositories;

import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ims.features.auth.entities.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByStatusNotIn(List<UserStatus> statuses, Pageable pageable);

    @Query("""
	SELECT u FROM User u
	WHERE u.status NOT IN :excluded
	AND (
	   TRIM(:search) = ''
	   OR (
		 u.name IS NOT NULL
		 AND LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%'))
	   )
	)
	""")
	Page<User> findUsers(@Param("excluded") List<UserStatus> excluded,
	                     @Param("search") String search,
	                     Pageable pageable);

    List<User> findByUserRoleIn(List<UserRole> roles);

    List<UserRole> UserRole(UserRole userRole);

    Optional<User> findByEmail(String email);
}
