package com.example.ims.features.vendor.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

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

    @GetMapping
    public VendorListResponse getVendors(
        @RequestParam(name = "type", required = false) String type,
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "page", defaultValue = "1") int page
    ) {
        return vendorService.getVendorList(type, keyword, page);
    }
    
    @PostMapping
    public Long createVendor(@RequestBody VendorCreateRequest request) {
        return vendorService.createVendor(request);
    }
    
    @GetMapping("/products")
    public List<Map<String, Object>> searchProducts(
        @RequestParam(name = "keyword", required = false) String keyword,
        @RequestParam(name = "excludeAssigned", defaultValue = "false") boolean excludeAssigned
    ) {
        return vendorService.searchProducts(keyword, excludeAssigned);
    }
    
    @GetMapping("/{id}")
    public VendorDetailResponse getVendorDetail(@PathVariable("id") Long id) {
        return vendorService.getVendorDetail(id);
    }
    
    @PutMapping("/{id}")
    public void updateVendor(@PathVariable("id") Long id, @RequestBody VendorCreateRequest request) {
        vendorService.updateVendor(id, request);
    }

    
    @DeleteMapping("/{id}")
    public void deleteVendor(@PathVariable("id") Long id) {
        vendorService.deleteVendor(id);
    }
    
    
    
    
 
    
    
}
