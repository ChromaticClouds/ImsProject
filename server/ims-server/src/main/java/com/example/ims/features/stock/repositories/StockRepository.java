package com.example.ims.features.stock.repositories;

import com.example.ims.features.stock.entities.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByProductId(Long id);
    List<Stock> findByProductIdIn(List<Long> productIds);
}
