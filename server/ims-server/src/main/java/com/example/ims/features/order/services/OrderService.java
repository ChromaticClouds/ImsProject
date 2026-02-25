package com.example.ims.features.order.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.enums.UserRole;
import com.example.ims.features.auth.enums.UserStatus;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.order.dto.*;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.enums.OrderStatus;
import com.example.ims.features.order.exceptions.OrderNotFoundException;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.exceptions.ProductNotFoundException;
import com.example.ims.features.product.repository.ProductRepository;
import com.example.ims.features.product.repository.ProductSpecification;
import com.example.ims.features.user.dto.UserIdentifier;
import com.example.ims.features.user.exceptions.NoPermissionException;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.enums.VendorStatus;
import com.example.ims.features.vendor.enums.VendorType;
import com.example.ims.features.vendor.exceptions.VendorNotFoundException;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import com.example.ims.features.vendor.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import java.util.stream.Stream;

@Service
@RequiredArgsConstructor
public class OrderService {

    private static final Integer PAGE_SIZE = 10;

    private final UserRepository userRepository;
    private final VendorRepository vendorRepository;
    private final VendorItemRepository vendorItemRepository;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final OrderSequenceGenerator sequenceGenerator;

    public OrderBootstrap getOrderBootstrap() {
        List<UserIdentifier> users = userRepository
            .findByUserRoleInAndStatus(
                List.of(UserRole.OUTBOUND),
                UserStatus.ACTIVE
            )
            .stream()
            .map(u -> new UserIdentifier(u.getId(), u.getName()))
            .toList();

        List<VendorIdentifier> sellers = vendorRepository
            .findByTypeAndStatusNot(VendorType.Seller, VendorStatus.DELETED)
            .stream()
            .map(v -> new VendorIdentifier(v.getId(), v.getVendorName()))
            .toList();

        String sequence = sequenceGenerator.generateReceiveOrder();

        return new OrderBootstrap(users, sellers, sequence);
    }

    public List<OrderProduct> getProducts(String search) {
        Specification<VendorItem> spec = Specification
            .where(ProductSpecification.productsIn(search));

        return vendorItemRepository.findAll(spec).stream()
            .map(VendorItem::getProduct)
            .filter(Objects::nonNull)
            .map(OrderProduct::from)
            .distinct()
            .toList();
    }

    @Transactional
    public void postOrder(Long userId, OrderPostRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(UserNotFoundException::new);

        if (!List.of(UserRole.ALL, UserRole.RECEIVE_ORDER).contains(user.getUserRole()))
            throw new NoPermissionException();

        User manager = userRepository.findById(request.getUserId())
            .orElseThrow(UserNotFoundException::new);

        Vendor vendor = vendorRepository.findById(request.getSellerId())
            .orElseThrow(VendorNotFoundException::new);

        String orderNumber = sequenceGenerator.issueReceiveOrder();

        List<Order> orders = request.getProducts().stream().map(p -> {
            Product product = productRepository.findById(p.id())
                .orElseThrow(ProductNotFoundException::new);

            return Order.builder()
                .user(user)
                .manager(manager)
                .vendor(vendor)
                .product(product)
                .orderNumber(orderNumber)
                .orderDate(request.getOrderDate())
                .recieveDate(request.getReceiveDate())
                .count(p.amount())
                .status(OrderStatus.OUTBOUND_PENDING)
                .build();
        }).toList();

        orderRepository.saveAll(orders);
    }

    public Page<OrderSummary> getReceiveOrders(
        Integer page,
        String search,
        LocalDate fromDate,
        LocalDate toDate,
        Long salerId
    ) {
        Pageable pageable = PageRequest.of(page, PAGE_SIZE);

        return orderRepository.findOrderSummaries(
            OrderStatus.OUTBOUND_PENDING,
            search,
            fromDate,
            toDate,
            salerId,
            pageable
        );
    }

    public List<UserIdentifier> getOutboundManagers() {
        List<User> managers = userRepository.findByUserRoleInAndStatus(
            List.of(UserRole.OUTBOUND),
            UserStatus.ACTIVE
        );

        return managers.stream().map(UserIdentifier::from).toList();
    }

    @Transactional
    public void assignOutboundManager(String orderNumber, Long managerId) {
        List<Order> orders =
            orderRepository.findOrdersByOrderNumber(orderNumber);

        if (orders.isEmpty()) {
            throw new OrderNotFoundException(orderNumber);
        }

        boolean noChange = orders.stream()
            .allMatch(o -> o.isSameManager(managerId));

        if (noChange) return;

        if (managerId == null) {
            orders.forEach(Order::unassignManager);
            return;
        }

        User manager = userRepository.findById(managerId)
            .orElseThrow(UserNotFoundException::new);

        orders.forEach(o -> o.assignManager(manager));
    }

    public List<VendorIdentifier> getSalers() {
        return orderRepository.getSalers(OrderStatus.OUTBOUND_PENDING);
    }

    public List<OrderDetail> getItemsByOrderNumber(String orderNumber) {
        return orderRepository.getItemsByOrderNumber(
            orderNumber,
            OrderStatus.OUTBOUND_PENDING
        );
    }
}
