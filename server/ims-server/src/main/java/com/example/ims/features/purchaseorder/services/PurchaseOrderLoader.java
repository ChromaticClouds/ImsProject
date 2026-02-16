package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class PurchaseOrderLoader {

    private final OrderRepository orderRepository;

    public PurchaseOrderContext load(String orderNumber) {
        List<Order> orders = orderRepository
            .findAllByOrderNumber(orderNumber)
            .stream()
            .toList();

        if (orders.isEmpty())
            throw new IllegalStateException("해당 주문번호의 발주 데이터가 없습니다.");

        List<VendorItem> items = orders.stream()
                .map(Order::getVendorItem)
                .filter(Objects::nonNull)
                .toList();

        if (items.isEmpty())
            throw new IllegalStateException("발주 품목이 비어있습니다.");

        List<Long> vendorIds = items.stream().map(VendorItem::getVendor)
            .filter(Objects::nonNull)
            .map(Vendor::getId)
            .distinct()
            .toList();

        if (vendorIds.size() != 1)
            throw new IllegalStateException("하나의 발주서는 단일 공급처만 허용됩니다.");

        Vendor vendor = items.getFirst().getVendor();

        if (vendor.getEmail() == null || vendor.getEmail().isEmpty())
            throw new IllegalStateException("공급처 이메일이 없어 전송할 수 없습니다.");

        return new PurchaseOrderContext(orderNumber, vendor, orders);
    }
}
