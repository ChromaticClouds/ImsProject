package com.example.ims.features.order.services;

import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.order.dto.OrderBootstrap;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.order.repositories.OrderSequenceRepository;
import com.example.ims.features.user.dto.UserIdentifier;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.features.vendor.enums.VendorType;
import com.example.ims.features.vendor.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final OrderSequenceGenerator sequenceGenerator;

    public List<Order> getReceiveOrders() {
        return orderRepository.findAll();
    }

    public OrderBootstrap getOrderBootstrap() {
        List<UserIdentifier> users = userRepository
            .findByUserRoleIn(List.of(UserRole.ALL, UserRole.RECEIVE_ORDER))
            .stream()
            .map(u -> new UserIdentifier(u.getId(), u.getName()))
            .toList();

        List<VendorIdentifier> sellers = vendorRepository
            .findByType(VendorType.Seller)
            .stream()
            .map(v -> new VendorIdentifier(v.getId(), v.getVendorName()))
            .toList();

        String sequence = sequenceGenerator.generate();

        return new OrderBootstrap(users, sellers, sequence);
    }

    @Transactional
    public Order createOrder() {
        Order order = new Order();
        order.setOrderDate(LocalDate.now());

        return orderRepository.save(order);
    }
}
