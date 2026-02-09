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

	// 입고 대기 주문 목록(기간, 페이지)
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingList")
    List<InboundOrderRow> selectPendingList(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );

    
    // 입고 대기 주문 갯수
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countPending")
    long countPending(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword
    );

    // 입고 완료 목록
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedList")
    List<InboundOrderRow> selectCompletedList(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );

    // 입고 완료 갯수
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countCompleted")
    long countCompleted(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword
    );

    // 주문 번호에 대한 상세 정보
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectOrderDetail")
    InboundOrderDetail selectOrderDetail(@Param("orderId") Long orderId);

    // 주문 상태 변경 (대기)
    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundPending")
    int markInboundPending(@Param("orderId") Long orderId);

    // 주문 상태 변경 (완료)
    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundComplete")
    int markInboundComplete(@Param("orderId") Long orderId);

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectStatusSnapshot")
    InboundStatusUpdateResponse selectStatusSnapshot(@Param("orderId") Long orderId);

    // 입고 대기 중인 제품 품목별 요약 
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingSummary")
    List<InboundSummaryRow> selectPendingSummary(InboundSummaryParam param);

    // 입고 대기 중인 제품 거래처별 요약 
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countPendingSummary")
    long countPendingSummary(InboundSummaryParam param);

    // 주문 번호에 포함된 여러 개 상품 리스트(대기)
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingItemsByOrderNumber")
    List<InboundItemRow> selectPendingItemsByOrderNumber(@Param("orderNumber") String orderNumber);

    // 오늘 처리된 입고 내역
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedTodaySummary")
    List<InboundSummaryRow> selectCompletedTodaySummary(
        @Param("keyword") String keyword,
        @Param("offset") int offset,
        @Param("size") int size
    );

    // 오늘 처리된 입고 내역 조회 갯수
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "countCompletedTodaySummary")
    long countCompletedTodaySummary(@Param("keyword") String keyword);

    // 주문 번호에 포함된 여러 개 상품 리스트(완ㄹ요)
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectCompletedItemsByOrderNumber")
    List<InboundItemRow> selectCompletedItemsByOrderNumber(@Param("orderNumber") String orderNumber);

    // 납기일 일자
    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "updateReceiveDateByOrderNumber")
    int updateReceiveDateByOrderNumber(
        @Param("orderNumber") String orderNumber,
        @Param("receiveDate") LocalDate receiveDate
    );

    // 입고 예정 제품 수
    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "updateOrderQty")
    int updateOrderQty(
        @Param("orderId") Long orderId,
        @Param("orderQty") Integer orderQty
    );

    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectPendingDetailHeader")
    PendingDetailResponse selectPendingDetailHeader(@Param("orderNumber") String orderNumber);

    // ---- 완료 처리용 ----

    // 완료 처리 전, 최종 확인 데이터
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectOrdersForInboundCompleteByOrderNumber")
    List<InboundCompleteOrderRow> selectOrdersForInboundCompleteByOrderNumber(
        @Param("orderNumber") String orderNumber
    );

    // 제품 몇 개인지 수량 확인 --> history beforeCount --> afterCount 때문에
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectLatestAfterCountForUpdate")
    Integer selectLatestAfterCountForUpdate(@Param("vendorItemId") Long vendorItemId);

  
    @SelectProvider(type = InboundQuerySqlProvider.class, method = "selectProductIdByVendorItemId")
    Long selectProductIdByVendorItemId(@Param("vendorItemId") Long vendorItemId);

    // 해당 제품 변동 내역 표시
    @InsertProvider(type = InboundQuerySqlProvider.class, method = "insertHistoryRow")
    int insertHistoryRow(
        @Param("lotId") Long lotId,
        @Param("vendorItemId") Long vendorItemId,
        @Param("productId") Long productId,
        @Param("beforeCount") Integer beforeCount,
        @Param("afterCount") Integer afterCount
    );

    // 주문 번호 기준 해당 주문에 속한 항목 완료 처리
    @UpdateProvider(type = InboundQuerySqlProvider.class, method = "markInboundCompleteByOrderNumber")
    int markInboundCompleteByOrderNumber(@Param("orderNumber") String orderNumber);

    // stock upsert 누적
    @InsertProvider(type = InboundQuerySqlProvider.class, method = "upsertStockByProductId")
    int upsertStockByProductId(
        @Param("productId") Long productId,
        @Param("delta") Integer delta
    );

    // user, 유형, 메모 생성. @Options으로 방금 만든  기록 ID값 받아옴. 
    @Insert("""
        INSERT INTO history_lot (user_id, status, memo)
        VALUES (#{userId}, #{status}, #{memo})
    """)
    @Options(useGeneratedKeys = true, keyProperty = "id", keyColumn = "id")
    int insertHistoryLot(HistoryLot lot);
}



