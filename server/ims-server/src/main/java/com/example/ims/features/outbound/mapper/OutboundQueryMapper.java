package com.example.ims.features.outbound.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;

import com.example.ims.features.outbound.dto.OutboundAssigneeRow;
import com.example.ims.features.outbound.dto.OutboundCompleteOrderRow;
import com.example.ims.features.outbound.dto.OutboundItemRow;
import com.example.ims.features.outbound.dto.OutboundStockProductRow;
import com.example.ims.features.outbound.dto.OutboundSummaryRow;

@Mapper
public interface OutboundQueryMapper {

  
  @SelectProvider(type = OutboundSqlProvider.class, method = "selectOutboundAssignees")
  List<OutboundAssigneeRow> selectOutboundAssignees();

  @SelectProvider(type = OutboundSqlProvider.class, method = "selectPendingSummary")
  List<OutboundSummaryRow> selectPendingSummary(
      @Param("from") LocalDate from,
      @Param("to") LocalDate to,
      @Param("userId") Long userId,   
      @Param("offset") int offset,
      @Param("size") int size
  );

  @SelectProvider(type = OutboundSqlProvider.class, method = "countPendingSummary")
  long countPendingSummary(
      @Param("from") LocalDate from,
      @Param("to") LocalDate to,
      @Param("userId") Long userId  
  );

  @SelectProvider(type = OutboundSqlProvider.class, method = "selectPendingItemsByOrderNumber")
  List<OutboundItemRow> selectPendingItemsByOrderNumber(@Param("orderNumber") String orderNumber);

  @SelectProvider(type = OutboundSqlProvider.class, method = "selectCompletedTodaySummary")
  List<OutboundSummaryRow> selectCompletedTodaySummary(
      @Param("offset") int offset,
      @Param("size") int size
  );

  @SelectProvider(type = OutboundSqlProvider.class, method = "countCompletedTodaySummary")
  long countCompletedTodaySummary();

  @SelectProvider(type = OutboundSqlProvider.class, method = "selectCompletedItemsByOrderNumber")
  List<OutboundItemRow> selectCompletedItemsByOrderNumber(@Param("orderNumber") String orderNumber);

  @SelectProvider(type = OutboundSqlProvider.class, method = "selectOrdersForOutboundComplete")
  List<OutboundCompleteOrderRow> selectOrdersForOutboundComplete(@Param("orderNumber") String orderNumber);

  @SelectProvider(type = OutboundSqlProvider.class, method = "selectStockCountForUpdate")
  Integer selectStockCountForUpdate(@Param("productId") Long productId);

  @UpdateProvider(type = OutboundSqlProvider.class, method = "upsertStockByDelta")
  int upsertStockByDelta(@Param("productId") Long productId, @Param("delta") Integer delta);

  @InsertProvider(type = OutboundSqlProvider.class, method = "insertHistoryOutbound")
  int insertHistoryOutbound(
      @Param("userId") Long userId,
      @Param("productId") Long productId,
      @Param("beforeCount") Integer beforeCount,
      @Param("afterCount") Integer afterCount
  );

  @UpdateProvider(type = OutboundSqlProvider.class, method = "markOutboundCompleteByOrderNumber")
  int markOutboundCompleteByOrderNumber(@Param("orderNumber") String orderNumber);

  @InsertProvider(type = OutboundSqlProvider.class, method = "insertHistoryLot")
  int insertHistoryLot(@Param("userId") Long userId, @Param("memo") String memo);
  
  @SelectProvider(type = OutboundSqlProvider.class, method = "selectStockTypes")
  List<String> selectStockTypes();
  
  @SelectProvider(type = OutboundSqlProvider.class, method = "selectStockBrandsByType")
  List<String> selectStockBrandsByType(@Param("type") String type);
  
  @SelectProvider(type = OutboundSqlProvider.class, method = "selectStockProducts")
  List<OutboundStockProductRow> selectStockProducts(
		  @Param("type") String type,
		  @Param("brand") String brand
		  );
  
}


