package com.example.ims.features.order.repositories;

import com.example.ims.features.order.entities.Order;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Order, Long> {}
