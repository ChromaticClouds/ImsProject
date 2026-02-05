package com.example.ims.features.product.repository;

import com.example.ims.features.product.dto.ProductSuggest;
import com.example.ims.features.product.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository
    extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product>
{

    @Query("""
    SELECT new com.example.ims.features.product.dto.ProductSuggest(
        vi.id, p.id, p.name, p.brand, p.type, vi.purchasePrice, p.salePrice, s.count, p.imageUrl
    )
    FROM Product p
    JOIN p.stock s
    JOIN p.vendorItems vi
  
    WHERE
        LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(p.type) LIKE LOWER(CONCAT('%', :search, '%'))
        OR LOWER(p.brand) LIKE LOWER(CONCAT('%', :search, '%'))
    ORDER BY p.name
    """)
    List<ProductSuggest> suggest(@Param("search") String search);
}
