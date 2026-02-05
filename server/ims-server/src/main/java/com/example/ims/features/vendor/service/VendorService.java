package com.example.ims.features.vendor.service;

import java.util.List;
import java.util.Collections;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.example.ims.features.vendor.dto.PageInfo;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.dto.VendorCreateRequest;
import com.example.ims.features.vendor.dto.VendorListResponse;
import com.example.ims.features.vendor.dto.VendorResponse;
import com.example.ims.features.vendor.mapper.VendorMapper;
import com.example.ims.features.vendor.dto.VendorDetailResponse;
import com.example.ims.features.vendor.dto.VendorItemResponse;
import com.example.ims.features.vendor.dto.VendorDetailVendor;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor

public class VendorService {
	
	private static final int PAGE_SIZE = 10;

    private final VendorMapper mapper;

    public VendorListResponse getVendorList(String type, String keyword, int page) {
        if (type != null && type.isBlank()) type = null;
        if (keyword != null && keyword.isBlank()) keyword = null;
        
        int currentPage = Math.max(page, 1);
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

    @Transactional
    public Long createVendor(VendorCreateRequest request) {
        Vendor dto = Vendor.from(request);
        mapper.insertVendor(dto);

        Long vendorId = dto.getId();

        if ("Supplier".equals(request.getType())  && request.getItems() != null && !request.getItems().isEmpty()) {

            mapper.insertVendorItems(vendorId, request.getItems());
        }

        return vendorId;
    }
    
    public List<Map<String, Object>> searchProducts(String keyword, boolean excludeAssigned) {
        if (keyword != null && keyword.isBlank()) keyword = null;
        return mapper.searchProducts(keyword, excludeAssigned);
    }
    
    public VendorDetailResponse getVendorDetail(Long id) {
        VendorDetailVendor vendor = mapper.findVendorById(id);
        if (vendor == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + id);
        }

        List<VendorItemResponse> items =
            "Supplier".equals(vendor.getType())
                ? mapper.findVendorItems(id)
                : Collections.emptyList();

        return VendorDetailResponse.builder()
            .vendor(vendor)
            .items(items)
            .build();
    }

    @Transactional
    public void updateVendor(Long id, VendorCreateRequest request) {

        VendorDetailVendor existing = mapper.findVendorById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + id);
        }

        // 1) vendor 기본 정보 업데이트
        mapper.updateVendor(id, request);

        // 2) 판매처면: 품목 연결을 모두 "DELETED" 처리하고 끝
        if (!"Supplier".equals(request.getType())) {
            mapper.softDeleteVendorItemsByVendorId(id);
            return;
        }

        // 3) 공급처면: 기존 연결을 일단 DELETED로 만든 뒤,
        //    request.items에 있는 것들은 UPDATE(있으면) or INSERT(없으면) 해서 ACTIVE로 복구
        mapper.softDeleteVendorItemsByVendorId(id);

        if (request.getItems() == null || request.getItems().isEmpty()) {
            return;
        }

        for (VendorCreateRequest.VendorItemCreate it : request.getItems()) {
            Long vendorItemId = mapper.findVendorItemId(id, it.getProductId());

            if (vendorItemId != null) {
                mapper.updateVendorItemPrice(vendorItemId, it.getPurchasePrice());
            } else {
                // 기존 bulk insert 메서드 재사용해도 되지만, 단건 insert가 편함
                mapper.insertVendorItems(id, List.of(it));
            }
        }
    }

    @Transactional
    public void deleteVendor(Long id) {
        int updated = mapper.softDeleteVendor(id);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + id);
        }
    }
}
