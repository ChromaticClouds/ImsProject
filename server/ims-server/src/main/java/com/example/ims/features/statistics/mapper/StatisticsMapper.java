package com.example.ims.features.statistics.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.SelectProvider;

import com.example.ims.features.statistics.dto.ClientRankRow;
import com.example.ims.features.statistics.dto.InOutByProductRow;


@Mapper
public interface StatisticsMapper {

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

}
