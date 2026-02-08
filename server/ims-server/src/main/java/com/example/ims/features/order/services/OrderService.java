package com.example.ims.features.order.services;

import com.example.ims.features.order.dto.OrderCategories;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.user.dto.UserIdentifier;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.features.vendor.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;

    public List<Order> getReceiveOrders() {
        return orderRepository.findAll();
    }

    public OrderCategories getCategories() {
        List<UserIdentifier> users = userRepository.findAll().stream().map(u ->
            new UserIdentifier(u.getId(), u.getName())).toList();
    }
}
