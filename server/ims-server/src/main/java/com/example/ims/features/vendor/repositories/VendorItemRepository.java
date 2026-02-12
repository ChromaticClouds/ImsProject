package com.example.ims.features.vendor.repositories;

import com.example.ims.features.vendor.entities.VendorItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.util.List;
import java.util.Optional;

public interface VendorItemRepository
    extends JpaRepository<VendorItem, Long>,
            JpaSpecificationExecutor<VendorItem> {

    Optional<VendorItem> findByProductId(Long id);
    List<VendorItem> findAllByVendorId(Long vendorId);
}
