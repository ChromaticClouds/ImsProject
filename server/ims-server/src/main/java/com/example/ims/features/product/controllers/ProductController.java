package com.example.ims.features.product.controllers;

import com.example.ims.features.product.dto.ProductFilterResponse;
import com.example.ims.features.product.dto.ProductResponse;
import com.example.ims.features.product.dto.ProductSuggest;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.service.ProductService;
import com.example.ims.global.dto.PageResponse;
import com.example.ims.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/product")
public class ProductController {

    private static final int PAGE_SIZE = 10;

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<PageResponse<ProductResponse>>> getProducts(
        @RequestParam(value = "page", defaultValue = "1") int page,
        @RequestParam(value = "search", defaultValue = "") String search,
        @RequestParam(value = "type", required = false) String type,
        @RequestParam(value = "brand", required = false) String brand
    ) {
        Pageable pageable = PageRequest.of(page - 1, PAGE_SIZE);

        List<String> types = type.isBlank()
                ? List.of()
                : Arrays.asList(type.split(","));

        List<String> brands = brand.isBlank()
                ? List.of()
                : Arrays.asList(brand.split(","));

        PageResponse<Product> products =
            productService.getProducts(pageable, search, types, brands);

        return ResponseEntity.ok(ApiResponse.success(ProductResponse.from(products)));
    }

    @GetMapping("/categories")
    public ResponseEntity<ApiResponse<ProductFilterResponse>> getProductFilters() {
        return ResponseEntity.ok(ApiResponse.success(
            productService.getProductFilters()
        ));
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
