package com.example.ims.features.vendor.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.features.vendor.dto.VendorListResponse;
import com.example.ims.features.vendor.service.VendorService;

import lombok.RequiredArgsConstructor;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.ims.features.vendor.dto.VendorCreateRequest;


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
}
