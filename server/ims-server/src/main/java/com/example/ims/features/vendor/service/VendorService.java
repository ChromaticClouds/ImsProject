package com.example.ims.features.vendor.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ims.features.vendor.dto.PageInfo;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.dto.VendorCreateRequest;
import com.example.ims.features.vendor.dto.VendorListResponse;
import com.example.ims.features.vendor.dto.VendorResponse;
import com.example.ims.features.vendor.mapper.VendorMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class VendorService {
	
	private static final int PAGE_SIZE = 10;

    private final VendorMapper mapper;

    public VendorListResponse getVendorList(String type, String keyword, int page) {
        if (type != null && type.isBlank()) type = null;
        if (keyword != null && keyword.isBlank()) keyword = null;
        
        int currentPage = Math.max(page, -1);
        int offset = (currentPage - 1) * PAGE_SIZE;
        
        long total = mapper.countVendorList(type, keyword);
        int totalPages = (int) Math.ceil((double) total / PAGE_SIZE);
        
        List<VendorResponse> list =
        	mapper.findVendorList(type, keyword, PAGE_SIZE, offset);
        
        return VendorListResponse.builder()
            .list(list)
            .pageInfo(PageInfo.builder()
                .page(currentPage)
                .size(PAGE_SIZE)
                .totalElements(total)
                .totalPages(totalPages)
                .build()
            ).build();
    }
    
    public Long createVendor(VendorCreateRequest request) {
        Vendor dto = Vendor.from(request);
        mapper.insertVendor(dto);
        return dto.getId();
    }
}
