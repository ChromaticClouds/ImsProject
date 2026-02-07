package com.example.ims.features.product.controllers;

import com.example.ims.features.product.dto.ProductSuggest;
import com.example.ims.features.product.entity.Product;
import com.example.ims.features.product.service.ProductService;
import com.example.ims.global.dto.PageResponse;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product")
public class ProductController {

    private static final int PAGE_SIZE = 10;

    private final ProductService productService;

    @GetMapping
    public PageResponse<Product> getProducts(
        @RequestParam(value = "page", defaultValue = "1") int page,
        @RequestParam(value = "search", defaultValue = "") String search
    ) {
        Pageable pageable = PageRequest.of(page - 1, PAGE_SIZE);
        
        return productService.getProducts(pageable, search);
    }

    @GetMapping("/{id}")
    public Product getProduct(@PathVariable Long id) {
        return productService.getProduct(id);
    }

    @GetMapping("suggest")
    public ResponseEntity<ApiResponse<List<ProductSuggest>>> suggest(
        @RequestParam("search") String search
    ) {
        return ResponseEntity.ok(
            ApiResponse.success(productService.suggest(search))
        );
    }
}
