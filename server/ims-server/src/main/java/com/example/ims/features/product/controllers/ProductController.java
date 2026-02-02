package com.example.ims.features.product.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.ims.global.response.ApiResponse;

@RestController
@RequestMapping("/product")
public class ProductController {
    
    @GetMapping
    public ResponseEntity<ApiResponse<Void>> getProduct() {
        Authentication auth =
            SecurityContextHolder.getContext().getAuthentication();

        System.out.println(auth == null ? "NO AUTH" : auth.toString());

        return ResponseEntity.ok(ApiResponse.success("Authorization successfully"));
    }
}
