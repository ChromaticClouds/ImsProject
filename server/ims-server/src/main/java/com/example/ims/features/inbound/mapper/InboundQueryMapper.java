package com.example.ims.features.inbound.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;

import com.example.ims.features.inbound.dto.*;

@Mapper
public interface InboundQueryMapper {

    // -------------------------
    // pending list / count (기존 유지)
    // -------------------------
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

    // -------------------------
    // completed list / count (기존 유지)
    // -------------------------
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

    // -------------------------
    // detail/status/update (기존 유지)
    // -------------------------
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectOrderDetail")
    InboundOrderDetail selectOrderDetail(@Param("orderId") Long orderId);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundPending")
    int markInboundPending(@Param("orderId") Long orderId);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundComplete")
    int markInboundComplete(@Param("orderId") Long orderId);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectStatusSnapshot")
    InboundStatusUpdateResponse selectStatusSnapshot(@Param("orderId") Long orderId);

    // -------------------------
    // pending summary (기존 유지)
    // -------------------------
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingSummary")
    List<PendingSummaryRow> selectPendingSummary(InboundPendingSummaryParam param);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countPendingSummary")
    long countPendingSummary(InboundPendingSummaryParam param);


    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingItemsByOrderNumber")
    List<PendingItemRow> selectPendingItemsByOrderNumber(@Param("orderNumber") String orderNumber);

 
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedTodaySummary")
    List<CompletedSummaryRow> selectCompletedTodaySummary(
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countCompletedTodaySummary")
    long countCompletedTodaySummary(@Param("keyword") String keyword);


    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedItemsByOrderNumber")
    List<CompletedItemRow> selectCompletedItemsByOrderNumber(@Param("orderNumber") String orderNumber);




    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "updateReceiveDateByOrderNumber")
    int updateReceiveDateByOrderNumber(@Param("orderNumber") String orderNumber,
                                       @Param("receiveDate") LocalDate receiveDate);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "updateOrderQty")
    int updateOrderQty(@Param("orderId") Long orderId,
                       @Param("orderQty") Integer orderQty);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingDetailHeader")
    PendingDetailResponse selectPendingDetailHeader(@Param("orderNumber") String orderNumber);
    
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectOrdersForInboundCompleteByOrderNumber")
    List<InboundCompleteOrderRow> selectOrdersForInboundCompleteByOrderNumber(
        @Param("orderNumber") String orderNumber
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectLatestAfterCountForUpdate")
    Integer selectLatestAfterCountForUpdate(@Param("vendorItemId") Long vendorItemId);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "insertHistoryRow")
    int insertHistoryRow(
        @Param("status") String status,
        @Param("userId") Long userId,
        @Param("vendorItemId") Long vendorItemId,
        @Param("beforeCount") Integer beforeCount,
        @Param("afterCount") Integer afterCount
    );

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundCompleteByOrderNumber")
    int markInboundCompleteByOrderNumber(@Param("orderNumber") String orderNumber);
    
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectProductIdByVendorItemId")
    Long selectProductIdByVendorItemId(@Param("vendorItemId") Long vendorItemId);

    // stock upsert 누적
    @InsertProvider(type = InboundQuerySqlProvider.class, method = "upsertStockByProductId")
    int upsertStockByProductId(
        @Param("productId") Long productId,
        @Param("delta") Integer delta
    );
    
}



