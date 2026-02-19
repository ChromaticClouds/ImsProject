package com.example.ims.features.purchaseorder.mappers;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.*;

import com.example.ims.features.inbound.dto.InboundSafeStockRow;
import com.example.ims.features.purchaseorder.dto.*;

@Mapper
public interface PurchaseOrderMapper {

    @SelectProvider(type = PurchaseOrderSqlProvider.class, method = "selectGroupedList")
    List<PurchaseOrderGroupRow> selectGroupedList(
        @Param("view") String view,
        @Param("keyword") String keyword,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("limit") int limit,
        @Param("offset") int offset
    );

    @SelectProvider(type = PurchaseOrderSqlProvider.class, method = "countGroupedList")
    long countGroupedList(
        @Param("view") String view,
        @Param("keyword") String keyword,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );

    @SelectProvider(type = PurchaseOrderSqlProvider.class, method = "selectSummary")
    PurchaseOrderSummaryRow selectSummary(
        @Param("view") String view,
        @Param("keyword") String keyword,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );

    @SelectProvider(type = PurchaseOrderSqlProvider.class, method = "selectGroupedOne")
    PurchaseOrderGroupRow selectGroupedOne(@Param("orderNumber") String orderNumber);

    @Select({
        "<script>",
        "SELECT",
        "  o.order_number AS orderNumber,",
        "  o.id AS orderId,",
        "  o.vendor_item_id AS vendorItemId,",
        "  vi.product_id AS productId,",
        "  pr.name AS productName,",
        "  pr.type AS type,",
        "  pr.brand AS brand,",
        "  pr.image_url AS imageUrl,",
        "  o.`count` AS count,",
        "  vi.purchase_price AS purchasePrice",
        "FROM orders o",
        "JOIN vendor_item vi ON vi.id = o.vendor_item_id",
        "JOIN product pr ON pr.id = vi.product_id",
        "WHERE o.order_number IN",
        "  <foreach collection='orderNumbers' item='n' open='(' separator=',' close=')'>",
        "    #{n}",
        "  </foreach>",
        "ORDER BY o.id ASC",
        "</script>"
    })
    List<PurchaseOrderItemRow> selectItemsByOrderNumbers(@Param("orderNumbers") List<String> orderNumbers);

    @SelectProvider(type = PurchaseOrderSqlProvider.class, method = "selectSafeStock")
    List<InboundSafeStockRow> selectSafeStock(@Param("productIds") List<Long> productIds);

    @Update("UPDATE orders SET recieve_date = #{recieveDate} WHERE order_number = #{orderNumber}")
    int updateRecieveDateByOrderNumber(@Param("orderNumber") String orderNumber, @Param("recieveDate") LocalDate recieveDate);

    @Update("UPDATE orders SET `count` = #{count} WHERE id = #{orderId}")
    int updateCountByOrderId(@Param("orderId") Long orderId, @Param("count") Long count);

    @Delete("DELETE FROM orders WHERE order_number = #{orderNumber}")
    int deleteByOrderNumber(@Param("orderNumber") String orderNumber);

    @Update("UPDATE orders SET status='INBOUND_PENDING' WHERE order_number = #{orderNumber}")
    int markSentByOrderNumber(@Param("orderNumber") String orderNumber);

    @Update({
        "<script>",
        "UPDATE orders SET status='INBOUND_PENDING' WHERE order_number IN",
        "<foreach collection='orderNumbers' item='n' open='(' separator=',' close=')'>",
        "  #{n}",
        "</foreach>",
        "</script>"
    })
    int bulkMarkSentByOrderNumbers(@Param("orderNumbers") List<String> orderNumbers);

    @Delete({
        "<script>",
        "DELETE FROM orders WHERE order_number IN",
        "<foreach collection='orderNumbers' item='n' open='(' separator=',' close=')'>",
        "  #{n}",
        "</foreach>",
        "</script>"
    })
    int bulkDeleteByOrderNumbers(@Param("orderNumbers") List<String> orderNumbers);
}



