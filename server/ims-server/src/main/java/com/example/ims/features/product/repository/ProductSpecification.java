package com.example.ims.features.product.repository;

import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;
import com.example.ims.features.vendor.entities.VendorItem;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;

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

    public static Specification<Product> typeIn(List<String> types) {
        return (root, query, cb) -> {
            if (types == null || types.isEmpty())
                return cb.conjunction();

            List<ProductType> enums = types.stream()
                    .map(ProductType::valueOf)
                    .toList();

            return root.get("type").in(enums);
        };
    }

    public static Specification<Product> brandIn(List<String> brands) {
        return (root, query, cb) -> {
            if (brands == null || brands.isEmpty())
                return cb.conjunction();

            return root.get("brand").in(brands);
        };
    }

    public static Specification<VendorItem> productsIn(String search) {
        return (root, query, cb) -> {
            root.fetch("product", JoinType.LEFT);
            query.distinct(true);

            Join<VendorItem, Product> product =
                    root.join("product", JoinType.LEFT);

            if (search == null || search.isBlank())
                return cb.conjunction();

            String like = "%" + search.toLowerCase() + "%";

            return cb.or(
                cb.like(cb.lower(product.get("name")), like),
                cb.like(cb.lower(product.get("type")), like),
                cb.like(cb.lower(product.get("brand")), like)
            );
        };
    }
}
