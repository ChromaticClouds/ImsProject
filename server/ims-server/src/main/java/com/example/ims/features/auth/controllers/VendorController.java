package com.example.ims.features.auth.controllers;

import com.example.ims.features.auth.dto.VendorListResponseDto;
import com.example.ims.features.auth.dto.VendorCreateRequestDto;
import com.example.ims.features.auth.services.VendorService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/vendors")
@RequiredArgsConstructor
public class VendorController {

    private final VendorService vendorService;

    /**
     * 거래처 목록 조회
     * /api/vendors?type=Supplier&keyword=삼성&page=0
     */
    @GetMapping
    public Page<VendorListResponseDto> getVendors(
            @RequestParam(name = "type", required = false) String type,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "page", defaultValue = "0") int page
    ) {
        return vendorService.getVendorList(type, keyword, page);
    }
    
    /**
     * 거래처 등록
     */
    @PostMapping
    public Long createVendor(@RequestBody VendorCreateRequestDto requestDto) {
        return vendorService.createVendor(requestDto);
    }
}
