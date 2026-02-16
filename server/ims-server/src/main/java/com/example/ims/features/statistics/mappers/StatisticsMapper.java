package com.example.ims.features.statistics.mappers;

import com.example.ims.features.inbound.dto.InboundSafeStockRow;

import com.example.ims.features.statistics.dto.ClientRankRow;
import com.example.ims.features.statistics.dto.InOutByProductRow;
import com.example.ims.features.statistics.dto.LeadTimeResponse;
import com.example.ims.features.statistics.dto.ProductShareResponse;
import com.example.ims.features.statistics.dto.StockRotationPoint;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Mapper
public interface StatisticsMapper {
    @Select("""
    select coalesce(sum(p.volume * s.count), 0) from product p join stock s
    on p.id = s.product_id
    """)
    Long sumUsedVolume();

    /*
     * TOP5 면적을 가장 많이 차지하는 품목에 대한 개수 및 품목명 조회
     */
     @Select("""
     select
         p.name as item,
         sum(s.count) as stock,
         sum(p.volume * s.count) as usedVolume
     from product p
     join stock s on p.id = s.product_id
     group by p.id, p.name
     order by usedVolume desc
     limit 5
    """)
    List<ProductShareResponse> findTop5ByUsedVolume();

    /**
     * 품목별 리드타임 통계 조회
     */
    @Select("""
    select p.name as name, avg(o.lead_time) as leadTime
    from orders o
    join vendor_item vi on o.vendor_item_id = vi.id
    join product p on vi.product_id = p.id
    where o.status = 'INBOUND_COMPLETE'
    and o.recieve_date between #{startDate} and #{endDate}
    group by p.name order by leadTime desc;
    """)
    List<LeadTimeResponse> findLeadTimeByProduct(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    /**
     * 거래처별 리드타임 통계 조회
     */
    @Select("""
    select v.vendor_name as name, avg(o.lead_time) as leadTime
    from orders o
    join vendor_item vi on o.vendor_item_id = vi.id
    join vendor v on vi.vendor_id = v.id
    where o.status = 'INBOUND_COMPLETE'
    and o.recieve_date between #{startDate} and #{endDate}
    group by v.vendor_name order by leadTime desc;
    """)
    List<LeadTimeResponse> findLeadTimeByVendor(
        @Param("startDate") LocalDate startDate,
        @Param("endDate") LocalDate endDate
    );

    // 품목별 입출고 조회
    @SelectProvider(type = StatisticsProvider.class, method = "selectInOutByProduct")
    List<InOutByProductRow> selectInOutByProduct(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("keyword") String keyword,
        @Param("type") String type,
        @Param("brand") String brand,
        @Param("limit") int limit
    );

    // 주종별 
    @SelectProvider(type = StatisticsProvider.class, method = "selectTypes")
    List<String> selectTypes();

    // 브랜드별
    @SelectProvider(type = StatisticsProvider.class, method = "selectBrandsByType")
    List<String> selectBrandsByType(@Param("type") String type);

    // 검색
    @SelectProvider(type = StatisticsProvider.class, method = "searchProducts")
    List<InOutByProductRow> searchProducts(
        @Param("keyword") String keyword,
        @Param("limit") int limit
    );

    // -------------------------------------------------------------
    // 거래처별 입출고 순위 통계

    @SelectProvider(type=StatisticsProvider.class, method="selectInboundPartnerRankTop")
    List<ClientRankRow> selectInboundPartnerRankTop(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("limit") int limit
    );

    @SelectProvider(type=StatisticsProvider.class, method="sumInboundPartnerRankTotal")
    Long sumInboundPartnerRankTotal(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );

    @SelectProvider(type=StatisticsProvider.class, method="selectOutboundPartnerRankTop")
    List<ClientRankRow> selectOutboundPartnerRankTop(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to,
        @Param("limit") int limit
    );

    @SelectProvider(type=StatisticsProvider.class, method="sumOutboundPartnerRankTotal")
    Long sumOutboundPartnerRankTotal(
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
    );
    
    // ----------------------------------------------------------------
    // 품목별 수량 그래프

    @SelectProvider(type=StatisticsProvider.class, method="selectStockByProduct")
    List<InboundSafeStockRow> selectStockByProduct(
        @Param("type") String type,
        @Param("unsafeOnly") boolean unsafeOnly,
        @Param("limit") int limit
    );
    
    // -------------------------------------------------------------------
    // 재고 회전율
    @SelectProvider(type = StatisticsProvider.class, method = "selectStockAt")
    Integer selectStockAt(
    	      @Param("productId") Long productId,
    	      @Param("at") LocalDateTime at
    	  );

    // 기간 출고 합계
    @SelectProvider(type = StatisticsProvider.class, method = "selectOutboundQty")
    Long selectOutboundQty(
    	      @Param("productId") Long productId,
    	      @Param("from") LocalDate from,
    	      @Param("to") LocalDate to
    	  );
    
    @SelectProvider(type=StatisticsProvider.class, method="searchrotationProducts")
    List<StockRotationPoint> searchrotationProducts(@Param("keyword") String keyword, @Param("limit") int limit);
    
    

}







