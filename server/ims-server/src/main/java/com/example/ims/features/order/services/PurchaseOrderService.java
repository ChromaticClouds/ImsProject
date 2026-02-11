package com.example.ims.features.order.services;

import com.example.ims.features.order.dto.OrderBootstrap;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.order.repositories.OrderSequenceRepository;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.features.vendor.enums.VendorType;
import com.example.ims.features.vendor.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final OrderRepository orderRepository;
    private final VendorRepository vendorRepository;
    private final OrderSequenceGenerator sequenceGenerator;

    public OrderBootstrap initBootstrap() {
        String sequence = sequenceGenerator.generatePlaceOrder();
        List<VendorIdentifier> suppliers = vendorRepository
            .findByType(VendorType.Supplier)
            .stream().map(VendorIdentifier::from).toList();

        return new OrderBootstrap(List.of(), suppliers, sequence);
    }
}
