package com.example.ims.features.order.services;

import com.example.ims.features.order.dto.OrderBootstrap;
import com.example.ims.features.product.dto.ProductSummary;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.repository.ProductRepository;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import com.example.ims.features.vendor.entities.VendorItem;
import com.example.ims.features.vendor.enums.VendorType;
import com.example.ims.features.vendor.repositories.VendorItemRepository;
import com.example.ims.features.vendor.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseOrderService {

    private final VendorRepository vendorRepository;
    private final VendorItemRepository vendorItemRepository;
    private final OrderSequenceGenerator sequenceGenerator;
    private final ProductRepository productRepository;

    public OrderBootstrap initBootstrap() {
        List<VendorIdentifier> vendors = vendorRepository
            .findByType(VendorType.Supplier)
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
}
