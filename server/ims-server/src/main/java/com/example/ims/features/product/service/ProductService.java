package com.example.ims.features.product.service;

import com.example.ims.features.product.dto.ProductFilterResponse;
import com.example.ims.features.product.dto.ProductSuggest;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.repository.ProductRepository;
import com.example.ims.features.product.repository.ProductSpecification;
import com.example.ims.global.dto.PageResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    public PageResponse<Product> getProducts(
        Pageable pageable,
        String search,
        List<String> types,
        List<String> brands
    ) {
        Specification<Product> spec = Specification
            .where(ProductSpecification.search(search))
            .and(ProductSpecification.typeIn(types))
            .and(ProductSpecification.brandIn(brands));

        return PageResponse.from(
            productRepository.findAll(spec, pageable)
        );
    }

    public ProductFilterResponse getProductFilters() {
        return new ProductFilterResponse(
            productRepository.findDistinctTypes(),
            productRepository.findDistinctBrands()
        );
    }

    public Product getProduct(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<ProductSuggest> suggest(String search) {
        return productRepository.suggest(search);
    }
}
