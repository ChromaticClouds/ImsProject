package com.example.ims.features.order.services;

import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.repositories.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository repository;

    public List<Order> getReceiveOrders() {
        return repository.findAll();
    }
}
