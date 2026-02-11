package com.example.ims.features.order.repositories;

import com.example.ims.features.order.dto.OrderDetail;
import com.example.ims.features.order.dto.OrderSummary;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.enums.OrderStatus;
import com.example.ims.features.vendor.dto.VendorIdentifier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

// OrderRepository - JPQL: Order 엔티티 납품 예정 날짜 receiveDate (x) -> recieveDate (o) MySQL 컬럼명 수정 필요
public interface OrderRepository extends JpaRepository<Order, Long> {
    @Query("""
    select new com.example.ims.features.order.dto.OrderSummary(
        o.orderNumber, o.user.name, o.vendor.vendorName, o.vendor.bossName,
        o.orderDate, o.recieveDate, count(o.id),
        sum(o.product.salePrice * o.count), m.id, m.name
    ) from Order o
    left join o.manager m
    where o.status = :status
    and (
        :search is null
        or lower(o.orderNumber) like lower(concat('%', :search, '%'))
        or lower(o.vendor.vendorName) like lower(concat('%', :search, '%'))
        or lower(o.vendor.bossName) like lower(concat('%', :search, '%'))
        or lower(o.user.name) like lower(concat('%', :search, '%'))
    )
    and (:fromDate is null or o.orderDate >= :fromDate)
    and (:toDate   is null or o.orderDate <= :toDate)
    and (:salerId  is null or o.vendor.id = :salerId)
    group by o.orderNumber, o.user.id, o.vendor.id, o.orderDate, o.recieveDate, m.id, m.name
    order by o.orderDate desc
    """)
    List<OrderSummary> findOrderSummaries(
        @Param("status") OrderStatus status,
        @Param("search") String search,
        @Param("fromDate") LocalDate fromDate,
        @Param("toDate") LocalDate toDate,
        @Param("salerId") Long salerId
    );

    @Query("""
    select o
    from Order o
    where o.orderNumber = :orderNumber
    """)
    List<Order> findOrdersByOrderNumber(
            @Param("orderNumber") String orderNumber
    );

    @Query("""
    select v.id as id, v.vendorName as name
    from Order o join o.vendor v
    where o.status = :status
    group by v.id, v.vendorName
    """)
    List<VendorIdentifier> getSalers(@Param("status") OrderStatus status);

    @Query("""
    select p.id as id, p.name as name, p.type as itemType,
    p.brand as brand, o.count as count, p.imageUrl
    from Order o join o.product p
    where o.status = :status
    and o.orderNumber = :orderNumber
    """)
    List<OrderDetail> getItemsByOrderNumber(
        @Param("orderNumber") String orderNumber,
        OrderStatus status
    );
}
