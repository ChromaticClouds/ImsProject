package com.example.ims.features.order.repositories;

import com.example.ims.features.order.dto.OrderSummary;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.enums.OrderStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

// OrderRepository - JPQL: Order 엔티티 납품 예정 날짜 receiveDate (x) -> recieveDate (o) MySQL 컬럼명 수정 필요
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
    select new com.example.ims.features.order.dto.OrderSummary(
        o.orderNumber, o.user.name, o.vendor.vendorName, o.vendor.bossName,
        o.orderDate, o.recieveDate, count(o.id), sum(o.product.perCount * o.count)
    ) from Order o
    where o.status = :status
    group by o.orderNumber, o.user.id, o.vendor.id, o.orderDate, o.recieveDate
    order by o.orderDate desc
    """)
    List<OrderSummary> findOrderSummaries(
        @Param("status") OrderStatus status
    );
}
