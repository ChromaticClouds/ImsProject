package com.example.ims.features.vendor.repositories;

import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.enums.VendorType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VendorRepository extends JpaRepository<Vendor, Long> {
    List<Vendor> findByType(VendorType type);
}
