package com.example.ims.features.history.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.SelectProvider;

import com.example.ims.features.history.dto.*;

@Mapper
public interface HistoryMapper {

	// 거래일순 내역
  @SelectProvider(type = HistoryProvider.class, method = "selectLotSummaries")
  List<HistoryLotSummaryRow> selectLotSummaries(
      @Param("from") String from,   // 기간
      @Param("to") String to,
      @Param("status") String status,     // INBOUND, OUTBOUND, ADJUST
      
      @Param("type") String type,         // 주종
      @Param("brand") String brand,       // 브랜드
      @Param("kind") String kind,         // 종류
      
      @Param("targetId") Long targetId,   // 선택된 id
      @Param("q") String q,               // 검색
      
      @Param("offset") int offset,        // 페이지
      @Param("size") int size
  );

  // 조건에 맞는 데이터 몇 개인지 세기 위함.
  @SelectProvider(type = HistoryProvider.class, method = "countLotSummaries")
  long countLotSummaries(
      @Param("from") String from,
      @Param("to") String to,
      @Param("status") String status,
      @Param("type") String type,
      @Param("brand") String brand,
      @Param("kind") String kind,
      @Param("targetId") Long targetId,
      @Param("q") String q
  );
  
  // 상세 정보 내역 헤더
  @SelectProvider(type = HistoryProvider.class, method = "selectLotDetailHeader")
  HistoryLotSummaryRow selectLotDetailHeader(@Param("lotId") Long lotId);

  // 상세 제품 리스트
  @SelectProvider(type = HistoryProvider.class, method = "selectLotDetailItems")
  List<HistoryLotSummaryRow> selectLotDetailItems(@Param("lotId") Long lotId);


  // 상세 정보 브랜드, 주종 - 검색하기 편하게 하기 위함.
  @SelectProvider(type = HistoryProvider.class, method = "selectBrandsByType")
  List<String> selectBrandsByType(@Param("type") String type);

  // 검색 드롭다운
  @SelectProvider(type = HistoryProvider.class, method = "searchSuggestions")
  List<HistorySearchSuggestionRow> searchSuggestions(@Param("q") String q, @Param("limit") int limit);
  
  @Select("""
		    SELECT DATE(MIN(h.created_at))
		    FROM history h
		  """)
		  String selectMinCreatedDateYmd();
  
  
}
