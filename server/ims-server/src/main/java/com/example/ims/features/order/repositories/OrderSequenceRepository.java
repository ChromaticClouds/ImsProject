package com.example.ims.features.order.repositories;

import com.example.ims.features.order.entities.OrderSequence;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderSequenceRepository extends JpaRepository<OrderSequence, String> {}
