package com.example.ims.features.auth.repositories;

import com.example.ims.features.auth.entities.Vendor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface VendorRepository extends JpaRepository<Vendor, Long> {

    Page<Vendor> findByType(String type, Pageable pageable);

    Page<Vendor> findByVendorNameContaining(String vendorName, Pageable pageable);

    Page<Vendor> findByTypeAndVendorNameContaining(
            String type,
            String vendorName,
            Pageable pageable
    );
}
