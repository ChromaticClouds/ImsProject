package com.example.ims.features.vendor.repositories;

import com.example.ims.features.vendor.entities.VendorItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VendorItemRepository extends JpaRepository<VendorItem, Long> {

    Optional<VendorItem> findByProductId(Long id);
}
