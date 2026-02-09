package com.example.ims.features.order.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.order.dto.OrderBootstrap;
import com.example.ims.features.order.dto.OrderPostRequest;
import com.example.ims.features.order.dto.OrderProduct;
import com.example.ims.features.order.dto.OrderSummary;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.entities.OrderSequence;
import com.example.ims.features.order.enums.OrderStatus;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.order.repositories.OrderSequenceRepository;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.exceptions.ProductNotFoundException;
import com.example.ims.features.product.repository.ProductRepository;
import com.example.ims.features.product.repository.ProductSpecification;
import com.example.ims.features.user.dto.UserIdentifier;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.enums.VendorType;
import com.example.ims.features.vendor.exceptions.VendorNotFoundException;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import com.example.ims.features.vendor.repositories.VendorRepository;
import com.example.ims.global.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
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
    private final VendorItemRepository vendorItemRepository;
    private final OrderSequenceRepository sequenceRepository;
    private final ProductRepository productRepository;
    private final OrderSequenceGenerator sequenceGenerator;

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

    public List<OrderProduct> getProducts(String search) {
        Specification<VendorItem> spec = Specification
            .where(ProductSpecification.productsIn(search));

        return vendorItemRepository
            .findAll(spec)
            .stream()
            .map(VendorItem::getProduct)
            .map(OrderProduct::from)
            .distinct()
            .toList();
    }

    @Transactional
    public void postOrder(OrderPostRequest request) {
        User user = userRepository.findById(request.getUserId())
            .orElseThrow(UserNotFoundException::new);

        Vendor vendor = vendorRepository.findById(request.getSellerId())
            .orElseThrow(VendorNotFoundException::new);

        String orderNumber = sequenceGenerator.issue();

        List<Order> orders = request.getProducts().stream().map(p -> {
            Product product = productRepository.findById(p.id())
                .orElseThrow(ProductNotFoundException::new);

            return Order.builder()
                .user(user)
                .vendor(vendor)
                .product(product)
                .orderNumber(orderNumber)
                .orderDate(request.getOrderDate())
                .recieveDate(request.getReceiveDate())
                .count(p.amount())
                .status(OrderStatus.INBOUND_PENDING)
                .build();
        }).toList();

        orderRepository.saveAll(orders);
    }

    public List<OrderSummary> getReceiveOrders() {
        return orderRepository.findOrderSummaries(OrderStatus.INBOUND_PENDING);
    }
}
