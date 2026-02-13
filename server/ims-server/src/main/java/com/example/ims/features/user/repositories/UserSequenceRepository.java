package com.example.ims.features.user.repositories;

import com.example.ims.features.user.entities.UserSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserSequenceRepository extends JpaRepository<UserSequence, Integer> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select u from UserSequence u where u.year = :year")
    Optional<UserSequence> findByYearForUpdate(Integer year);
}
