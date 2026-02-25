package com.example.ims.features.product.repository;

import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;
import com.example.ims.features.stock.entities.Stock;
import com.example.ims.features.vendor.entities.VendorItem;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import jakarta.persistence.criteria.Predicate;
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
            root.fetch("product", JoinType.INNER);
            query.distinct(true);

            Join<VendorItem, Product> product =
                root.join("product", JoinType.INNER);

            Join<Product, Stock> stock =
                product.join("stock", JoinType.INNER);

            Predicate stockCondition =
                    cb.gt(stock.get("count"), 0); // stock 테이블의 count 컬럼이 0보다 gt(greater) 큰 대상만 집계

            if (search == null || search.isBlank()) {
                return stockCondition;
            }

            String like = "%" + search.toLowerCase() + "%";

            Predicate searchCondition = cb.or(
                cb.like(cb.lower(product.get("name")), like),
                cb.like(cb.lower(product.get("type")), like),
                cb.like(cb.lower(product.get("brand")), like)
            );

            return cb.and(stockCondition, searchCondition);
        };
    }
}
