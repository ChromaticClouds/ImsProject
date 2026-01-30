package com.example.ims.features.auth.services;

import com.example.ims.features.auth.dto.VendorListResponseDto;
import com.example.ims.features.auth.dto.VendorCreateRequestDto;
import com.example.ims.features.auth.entities.Vendor;
import com.example.ims.features.auth.repositories.VendorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class VendorService {

    private final VendorRepository vendorRepository;

    public Page<VendorListResponseDto> getVendorList(
            String type,
            String keyword,
            int page
    ) {
        Pageable pageable = PageRequest.of(page, 10, Sort.by("createdAt").descending());

        Page<Vendor> vendorPage;

        if (type != null && keyword != null) {
            vendorPage = vendorRepository.findByTypeAndVendorNameContaining(type, keyword, pageable);
        } else if (type != null) {
            vendorPage = vendorRepository.findByType(type, pageable);
        } else if (keyword != null) {
            vendorPage = vendorRepository.findByVendorNameContaining(keyword, pageable);
        } else {
            vendorPage = vendorRepository.findAll(pageable);
        }

        return vendorPage.map(v ->
                VendorListResponseDto.builder()
                        .id(v.getId())
                        .type(v.getType())
                        .vendorName(v.getVendorName())
                        .telephone(v.getTelephone())
                        .email(v.getEmail())
                        .address(v.getAddress())
                        .build()
        );
    }
    
    public Long createVendor(VendorCreateRequestDto dto) {

        Vendor vendor = Vendor.builder()
                .type(dto.getType())
                .vendorName(dto.getVendorName())
                .telephone(dto.getTelephone())
                .email(dto.getEmail())
                .bossName(dto.getBossName())
                .address(dto.getAddress())
                .memo(dto.getMemo())
                .imageUrl(dto.getImageUrl())
                .build();

        Vendor savedVendor = vendorRepository.save(vendor);
        return savedVendor.getId();
    }
}
