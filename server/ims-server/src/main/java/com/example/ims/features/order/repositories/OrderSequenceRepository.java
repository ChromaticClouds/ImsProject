package com.example.ims.features.order.repositories;

import com.example.ims.features.order.entities.OrderSequence;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface OrderSequenceRepository extends JpaRepository<OrderSequence, String> {

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("SELECT o FROM OrderSequence o WHERE o.orderDate = :date")
    Optional<OrderSequence> findByIdForUpdate(@Param("date") String date);
}
