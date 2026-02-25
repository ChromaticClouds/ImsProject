package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.ims.features.inbound.mapper.InboundQuerySqlProvider;

class InboundQuerySqlProviderTest {

    private InboundQuerySqlProvider provider;

    @BeforeEach
    void setUp() {
        provider = new InboundQuerySqlProvider();
    }

    @Test
    @DisplayName("안전재고 조회 SQL: 상품 ID가 IN 절로 치환되는지 검증")
    void selectSafeStock_Test() {
        // given
        Map<String, Object> params = new HashMap<>();
        params.put("productIds", List.of(100L, 200L, 300L));

        String sql = provider.selectSafeStock(params);

        assertThat(sql).contains("WHERE pr.id IN (100,200,300)");
        assertThat(sql).contains("safetyStock"); // 결과 컬럼명 확인
        assertThat(sql).contains("INTERVAL 90 DAY"); // 통계 기간 파라미터 확인
    }

    @Test
    @DisplayName("입고 완료 물품 상세 SQL: 서브쿼리와 조인문 포함 여부 검증")
    void selectCompletedItemsByOrderNumber_Test() {
    	
        Map<String, Object> params = new HashMap<>();
        params.put("orderNumber", "ORD-20240101-001");

        String sql = provider.selectCompletedItemsByOrderNumber(params);

        // 1. 핵심 서브쿼리 로직 확
        assertThat(sql).contains("SELECT MAX(h2.lot_id)");
        // 2. 수량 계산 
        assertThat(sql).contains("COALESCE(SUM(h.after_count - h.before_count), o.`count`) AS orderQty");
        // 3. 조건절 확인
        assertThat(sql).contains("o.order_number = #{orderNumber}");
        assertThat(sql).contains("hl2.status = 'INBOUND'");
    }

    @Test
    @DisplayName("수량 수정 SQL: qty_changed 플래그가 1로 설정되는지 검증")
    void updateOrderQty_Test() {
        // given
        Map<String, Object> params = new HashMap<>();
        params.put("orderId", 500L);
        params.put("orderQty", 10);

        // when
        String sql = provider.updateOrderQty(params);

        // 1. UPDATE 테이블 확인
        assertThat(sql).contains("UPDATE");
        assertThat(sql).contains("`orders`");

        // 2. 수량 업데이트 확인
        assertThat(sql).contains("qty_changed = 1");
        assertThat(sql).contains("`count` = #{orderQty}");

        assertThat(sql).contains("WHERE");
        assertThat(sql).contains("id = #{orderId}");
        assertThat(sql).contains("status = 'INBOUND_PENDING'");
    }
}

























