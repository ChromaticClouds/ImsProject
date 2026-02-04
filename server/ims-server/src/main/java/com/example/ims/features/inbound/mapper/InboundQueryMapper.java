package com.example.ims.features.inbound.mapper;

import java.time.LocalDate;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;

import com.example.ims.features.inbound.dto.InboundOrderDetail;
import com.example.ims.features.inbound.dto.InboundOrderRow;
import com.example.ims.features.inbound.dto.InboundPendingSummaryParam;
import com.example.ims.features.inbound.dto.InboundStatusUpdateResponse;
import com.example.ims.features.inbound.dto.PendingDetailResponse;
import com.example.ims.features.inbound.dto.PendingItemRow;
import com.example.ims.features.inbound.dto.PendingSummaryRow;

import org.apache.ibatis.annotations.Param;

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
    List<PendingSummaryRow> selectPendingSummary(InboundPendingSummaryParam param);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countPendingSummary")
    long countPendingSummary(InboundPendingSummaryParam param);


    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingItemsByOrderNumber")
    List<PendingItemRow> selectPendingItemsByOrderNumber(@Param("orderNumber") String orderNumber);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingDetailHeader")
    PendingDetailResponse selectPendingDetailHeader(@Param("orderNumber") String orderNumber);

    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundCompleteByOrderNumber")
    int markInboundCompleteByOrderNumber(@Param("orderNumber") String orderNumber);
    
    

}


