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

        if ("Supplier".equals(request.getType())
            && request.getItems() != null
            && !request.getItems().isEmpty()) {

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
        // 존재 확인
        VendorDetailVendor existing = mapper.findVendorById(id);
        if (existing == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + id);
        }

        // vendor 기본 정보 업데이트
        mapper.updateVendor(id, request);

        // 공급처면 items 갱신(단순하게 전체 삭제 후 재삽입)
        mapper.deleteVendorItemsByVendorId(id);

        if ("Supplier".equals(request.getType())
            && request.getItems() != null
            && !request.getItems().isEmpty()) {
            mapper.insertVendorItems(id, request.getItems()); // 너가 만들어둔 bulk insert 그대로 사용
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
