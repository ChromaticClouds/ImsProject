package com.example.ims.features.vendor.service;

import java.util.List;
import java.util.Collections;
import java.util.Map;

import org.springframework.cglib.core.CollectionUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import com.example.ims.features.vendor.dto.PageInfo;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.dto.VendorCreateRequest;
import com.example.ims.features.vendor.dto.VendorListResponse;
import com.example.ims.features.vendor.dto.VendorResponse;
import com.example.ims.features.vendor.enums.VendorType;
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

    // 거래처 목록
    public VendorListResponse getVendorList(String type, String keyword, int page) {
    	
    	// 주종, 검색
        if (type != null && type.isBlank()) type = null;
        if (keyword != null && keyword.isBlank()) keyword = null;
        
        // 페이지 
        int currentPage = Math.max(page, 1);
        int offset = (currentPage - 1) * PAGE_SIZE;
        
        // 총 페이지, 검색
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

    
    // 거래처 등록
    @Transactional
    public Long createVendor(VendorCreateRequest request) {
      Vendor dto = Vendor.from(request);
      mapper.insertVendor(dto);

      Long vendorId = dto.getId();
      if (vendorId == null) {
        throw new IllegalStateException("vendor insert 후 id 생성 실패");
      }

      // Supplier이고 제품 null 아니고, 제품 수량 0 이상인 것만 가능
      if (request.getType() == VendorType.Supplier && request.getItems() != null && request.getItems().size() > 0 ) {
        mapper.insertVendorItems(vendorId, request.getItems());
      }

      return vendorId;
    }
    
    
    // 제품 검색 
    public List<Map<String, Object>> searchProducts(String keyword, boolean excludeAssigned, Long currentVendorId) {
        if (keyword != null && keyword.isBlank()) keyword = null;
        return mapper.searchProducts(keyword, excludeAssigned, currentVendorId);
    }

    

    // 거래처 상세
    public VendorDetailResponse getVendorDetail(Long id) {
        VendorDetailVendor vendor = mapper.findVendorById(id);
        if (vendor == null) {
          throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + id);
        }

        // type이 Supplier이면 mapper
        List<VendorItemResponse> items =
          "Supplier".equals(vendor.getType())
            ? mapper.findVendorItems(id)
            : Collections.emptyList();

        return VendorDetailResponse.builder()
          .vendor(vendor)
          .items(items)
          .build();
      }


    // 거래처 수정
    @Transactional
    public void updateVendor(Long id, VendorCreateRequest request) {
      VendorDetailVendor existing = mapper.findVendorById(id);
      if (existing == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + id);
      }

      mapper.updateVendor(id, request);

      // enum 판별
      if (request.getType() != VendorType.Supplier) {
        mapper.softDeleteVendorItemsByVendorId(id);
        return;
      }

      mapper.softDeleteVendorItemsByVendorId(id);

      if (request.getItems() == null || request.getItems().size() == 0) {
    	    return;
    	  }

      for (VendorCreateRequest.VendorItemCreate it : request.getItems()) {
        Long vendorItemId = mapper.findVendorItemId(id, it.getProductId());

        if (vendorItemId != null) {
          mapper.updateVendorItemPrice(vendorItemId, it.getPurchasePrice());
        } else {
          mapper.insertVendorItems(id, List.of(it));
        }
      }
    }

    // 거래처 삭제
    @Transactional
    public void deleteVendor(Long id) {
        int updated = mapper.softDeleteVendor(id);
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Vendor not found: " + id);
        }
    }
    
    @Transactional
    public void softDeleteVendorItem(Long vendorId, Long productId) {
      Long id = mapper.findVendorItemId(vendorId, productId);
      if (id == null) {
        throw new ResponseStatusException(HttpStatus.NOT_FOUND, "vendor_item not found");
      }
      mapper.softDeleteVendorItem(vendorId, productId);
    }

}
