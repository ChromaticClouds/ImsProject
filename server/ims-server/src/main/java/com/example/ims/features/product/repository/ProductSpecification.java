package com.example.ims.features.product.repository;

import com.example.ims.features.product.entity.Product;
import org.springframework.data.jpa.domain.Specification;

public class ProductSpecification {

    public static Specification<Product> search(String search) {
        return (root, query, cb) -> {
            if (search == null || search.isBlank())
                return cb.conjunction();

            String like = "%" + search.toLowerCase() + "%";

            return cb.or(
                cb.like(cb.lower(root.get("name")), like),
                cb.like(cb.lower(root.get("type")), like),
                cb.like(cb.lower(root.get("brand")), like)
            );
        };
    }
}
