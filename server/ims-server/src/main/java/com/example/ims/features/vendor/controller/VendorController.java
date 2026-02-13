package com.example.ims.features.vendor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.service.annotation.PutExchange;

import com.example.ims.features.vendor.dto.VendorListResponse;
import com.example.ims.features.vendor.service.VendorService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ims.features.vendor.dto.VendorCreateRequest;
import com.example.ims.features.vendor.dto.VendorDetailResponse;


@RestController
@RequestMapping("/vendor")
@RequiredArgsConstructor
public class VendorController {
    
    private final VendorService vendorService;

    // 거래처 리스트
    @GetMapping
    public VendorListResponse getVendors(
        @RequestParam(name = "type", required = false) String type,
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "page", defaultValue = "1") int page
    ) {
        return vendorService.getVendorList(type, keyword, page);
    }
    
    // 거래처 등록
    @PostMapping
    public Long createVendor(@RequestBody VendorCreateRequest request) {
        System.out.println("type=" + request.getType());
        System.out.println("vendorName=" + request.getVendorName());
        System.out.println("items=" + (request.getItems() == null ? "null" : request.getItems().size()));
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            System.out.println("first.productId=" + request.getItems().get(0).getProductId());
            System.out.println("first.purchasePrice=" + request.getItems().get(0).getPurchasePrice());
        }
        return vendorService.createVendor(request);
    }
    
    // 품목 검색
    @GetMapping("/products")
    public List<Map<String, Object>> searchProducts(
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "excludeAssigned", defaultValue = "false") boolean excludeAssigned,
        @RequestParam(name = "currentVendorId", required = false) Long currentVendorId // ✅ 추가
    ) {
        return vendorService.searchProducts(keyword, excludeAssigned, currentVendorId);
    }

    
    // 거래처 상세
    @GetMapping("/{id}")
    public VendorDetailResponse getVendorDetail(@PathVariable("id") Long id) {
        return vendorService.getVendorDetail(id);
    }
    
    // 거래처 수정
    @PutMapping("/{id}")
    public void updateVendor(@PathVariable("id") Long id, @RequestBody VendorCreateRequest request) {
        vendorService.updateVendor(id, request);
    }

    // 거래처 삭제
    @DeleteMapping("/{id}")
    public void deleteVendor(@PathVariable("id") Long id) {
        vendorService.deleteVendor(id);
    }
    
    
    @PatchMapping("/{vendorId}/items/{productId}")
    public void softDeleteVendorItem(
      @PathVariable("vendorId") Long vendorId,
      @PathVariable("productId") Long productId
    ) {
      vendorService.softDeleteVendorItem(vendorId, productId);
    }

    
    
    
 
    
    
}
