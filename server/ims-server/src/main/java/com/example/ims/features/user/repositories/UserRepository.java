package com.example.ims.features.user.repositories;

import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.ims.features.auth.entities.User;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Page<User> findByStatusNotIn(List<UserStatus> statuses, Pageable pageable);

    @Query("""
	select u from User u
	where u.status not in :excluded
	and (
	   trim(:search) = ''
	   or (
		 u.name is not null
		 and lower(u.name) like lower(concat('%', :search, '%'))
	   )
	)
	order by
		case u.status
			when 'ACTIVE' then 1
			when 'PENDING' then 2
		end,
		case u.userRank
			when 'FIRST_ADMIN' then 1
			when 'SECOND_ADMIN' then 2
			when 'EMPLOYEE' then 3
		end,
		u.eid asc
	""")
	Page<User> findUsers(@Param("excluded") List<UserStatus> excluded,
	                     @Param("search") String search,
	                     Pageable pageable);

    List<UserRole> UserRole(UserRole userRole);

    Optional<User> findByEmail(String email);

	List<User> findByUserRoleInAndStatus(
		List<UserRole> userRoles,
		UserStatus status
	);
}
