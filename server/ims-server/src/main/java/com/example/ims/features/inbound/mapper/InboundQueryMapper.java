package com.example.ims.features.inbound.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;

import com.example.ims.features.inbound.dto.*;

@Mapper
public interface InboundQueryMapper {

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingList")
    List<InboundOrderRow> selectPendingList(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countPending")
    long countPending(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedList")
    List<InboundOrderRow> selectCompletedList(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countCompleted")
    long countCompleted(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectOrderDetail")
    InboundOrderDetail selectOrderDetail(@Param("orderId") Long orderId);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundPending")
    int markInboundPending(@Param("orderId") Long orderId);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundComplete")
    int markInboundComplete(@Param("orderId") Long orderId);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectStatusSnapshot")
    InboundStatusUpdateResponse selectStatusSnapshot(@Param("orderId") Long orderId);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingSummary")
    List<InboundSummaryRow> selectPendingSummary(InboundSummaryParam param);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countPendingSummary")
    long countPendingSummary(InboundSummaryParam param);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingItemsByOrderNumber")
    List<InboundItemRow> selectPendingItemsByOrderNumber(@Param("orderNumber") String orderNumber);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedTodaySummary")
    List<InboundSummaryRow> selectCompletedTodaySummary(
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countCompletedTodaySummary")
    long countCompletedTodaySummary(@Param("keyword") String keyword);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedItemsByOrderNumber")
    List<InboundItemRow> selectCompletedItemsByOrderNumber(@Param("orderNumber") String orderNumber);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "updateReceiveDateByOrderNumber")
    int updateReceiveDateByOrderNumber(
        @Param("orderNumber") String orderNumber,
        @Param("receiveDate") LocalDate receiveDate
    );

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "updateOrderQty")
    int updateOrderQty(
        @Param("orderId") Long orderId,
        @Param("orderQty") Integer orderQty
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingDetailHeader")
    PendingDetailResponse selectPendingDetailHeader(@Param("orderNumber") String orderNumber);

    // ---- 완료 처리용 ----

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectOrdersForInboundCompleteByOrderNumber")
    List<InboundCompleteOrderRow> selectOrdersForInboundCompleteByOrderNumber(
        @Param("orderNumber") String orderNumber
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectLatestAfterCountForUpdate")
    Integer selectLatestAfterCountForUpdate(@Param("vendorItemId") Long vendorItemId);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectProductIdByVendorItemId")
    Long selectProductIdByVendorItemId(@Param("vendorItemId") Long vendorItemId);

    // ✅ history: lot_id 기반으로 insert
    @InsertProvider(type = InboundQuerySqlProvider.class, method = "insertHistoryRow")
    int insertHistoryRow(
        @Param("lotId") Long lotId,
        @Param("vendorItemId") Long vendorItemId,
        @Param("productId") Long productId,
        @Param("beforeCount") Integer beforeCount,
        @Param("afterCount") Integer afterCount
    );

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundCompleteByOrderNumber")
    int markInboundCompleteByOrderNumber(@Param("orderNumber") String orderNumber);

    // stock upsert 누적
    @InsertProvider(type = InboundQuerySqlProvider.class, method = "upsertStockByProductId")
    int upsertStockByProductId(
        @Param("productId") Long productId,
        @Param("delta") Integer delta
    );

    // ✅ history_lot 생성 + 생성된 id 받기 (가장 안전)
    @Insert("""
        INSERT INTO history_lot (user_id, status, memo)
        VALUES (#{userId}, #{status}, #{memo})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    int insertHistoryLot(HistoryLot lot);
}



