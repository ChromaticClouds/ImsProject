package com.example.ims.features.product.service;

import com.example.ims.features.product.dto.ProductSuggest;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.repository.ProductRepository;
import com.example.ims.features.product.repository.ProductSpecification;
import com.example.ims.global.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public PageResponse<Product> getProducts(Pageable pageable, String search) {
        return PageResponse.from(productRepository.findAll(
                ProductSpecification.search(search),
                pageable
        ));
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<ProductSuggest> suggest(String search) {
        return productRepository.suggest(search);
    }
}
