package com.example.ims.features.product.repository;

import com.example.ims.features.product.dto.ProductSuggest;
import com.example.ims.features.product.dto.ProductSummary;
import com.example.ims.features.product.entities.Product;
import com.example.ims.features.product.enums.ProductType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;

public interface ProductRepository
    extends JpaRepository<Product, Long>,
        JpaSpecificationExecutor<Product>
{

    @Query("select distinct p.type from Product p where p.type is not null")
    List<ProductType> findDistinctTypes();

    @Query("select distinct p.brand from Product p where p.brand is not null")

    List<String> findDistinctBrands();

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

    List<Product> findAllByIdIn(Collection<Long> ids);

    @Query("""
    select new com.example.ims.features.product.dto.ProductSummary(
        p.id, p.name, p.type, p.brand, p.salePrice, p.imageUrl)
    from VendorItem vi join vi.product p
    where vi.vendor.id = :supplierId
    and (
        :search is null
        or :search = ''
        or lower(p.name) like lower(concat('%', :search, '%'))
    )
    """)
    List<ProductSummary> findProductSummariesBySupplierIdAndSearch(
        @Param("supplierId") Long supplierId,
        @Param("search") String search
    );
}
