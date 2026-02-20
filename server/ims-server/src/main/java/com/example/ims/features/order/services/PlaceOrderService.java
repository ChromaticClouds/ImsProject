package com.example.ims.features.order.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.auth.exceptions.UserNotFoundException;
import com.example.ims.features.order.dto.OrderBootstrap;
import com.example.ims.features.order.dto.PurchaseOrderRequest;
import com.example.ims.features.order.dto.PurchasePostItem;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.product.dto.ProductSummary;
import com.example.ims.features.product.repository.ProductRepository;
import com.example.ims.features.user.repositories.UserRepository;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.enums.VendorStatus;
import com.example.ims.features.vendor.enums.VendorType;
import com.example.ims.features.vendor.exceptions.VendorItemNotFoundException;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import com.example.ims.features.vendor.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceOrderService {

    private final VendorRepository vendorRepository;
    private final VendorItemRepository vendorItemRepository;
    private final OrderSequenceGenerator sequenceGenerator;
    private final ProductRepository productRepository;
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public OrderBootstrap initBootstrap() {
        List<VendorIdentifier> vendors = vendorRepository
            .findByTypeAndStatusNot(VendorType.Supplier, VendorStatus.DELETED)
            .stream()
            .map(VendorIdentifier::from)
            .toList();

        return new OrderBootstrap(
            List.of(), vendors, sequenceGenerator.generatePlaceOrder()
        );
    }

    public List<ProductSummary> getProductsBySupplier(Long supplierId, String search) {
        return productRepository
            .findProductSummariesBySupplierIdAndSearch(supplierId, search);
    }

    @Transactional
    public void postPurchaseOrder(Long userId, PurchaseOrderRequest request) {
        User user = userRepository.findById(userId)
            .orElseThrow(UserNotFoundException::new);

        String orderNumber = sequenceGenerator.issuePlaceOrder();
        LocalDate orderDate = LocalDate.now();

        List<Long> vendorItemIds = request.getProducts().stream()
                .map(PurchasePostItem::getVendorItemId)
                .distinct()
                .toList();

        List<VendorItem> vendorItems = vendorItemRepository.findAllById(vendorItemIds);

        Map<Long, VendorItem> vendorItemMap = vendorItems.stream()
            .collect(Collectors.toMap(VendorItem::getId, v -> v));

        if (vendorItemMap.size() != vendorItemIds.size()) {
            throw new VendorItemNotFoundException();
        }

        List<Order> orders = request.getProducts().stream().map(p -> {

            VendorItem vendorItem = vendorItemMap.get(p.getVendorItemId());

            Order order = new Order();
            order.setUser(user);
            order.setOrderNumber(orderNumber);
            order.setOrderDate(orderDate);
            order.setRecieveDate(request.getDate());
            order.setCount(p.getCount());
            order.setStatus(null);
            order.setVendorItem(vendorItem);

            return order;
        }).toList();

        orderRepository.saveAll(orders);
    }

}
