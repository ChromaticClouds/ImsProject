package com.example.demo;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import com.example.ims.features.outbound.mapper.OutboundSqlProvider;

class OutboundQuerySqlProviderTest {

    private OutboundSqlProvider provider;

    @BeforeEach
    void setUp() {
        provider = new OutboundSqlProvider();
    }

    @Test
    @DisplayName("출고 대기 목록과 카운트가 미배정 주문을 동일하게 포함한다")
    void pendingSummaryIncludesUnassignedOrdersConsistently() {
        Map<String, Object> params = new HashMap<>();
        params.put("userId", null);

        String selectSql = provider.selectPendingSummary(params);
        String countSql = provider.countPendingSummary(params);

        assertThat(selectSql).contains("o.status = 'OUTBOUND_PENDING'");
        assertThat(selectSql).doesNotContain("o.manager_id IS NOT NULL");
        assertThat(selectSql).contains("COALESCE(MIN(um.name), '미배정') AS managerName");
        assertThat(countSql).contains("o.status = 'OUTBOUND_PENDING'");
        assertThat(countSql).doesNotContain("o.manager_id IS NOT NULL");
    }
}
