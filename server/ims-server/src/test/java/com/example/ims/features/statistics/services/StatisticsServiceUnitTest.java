package com.example.ims.features.statistics.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoInteractions;
import static org.mockito.Mockito.when;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.example.ims.features.statistics.dto.ClientRankRow;
import com.example.ims.features.statistics.mappers.StatisticsMapper;

@ExtendWith(MockitoExtension.class)
class StatisticsServiceUnitTest {

    @Mock
    StatisticsMapper mapper;

    @InjectMocks
    StatisticsService service;

    @Test
    void acceptsBusinessTodayWhenServerUtcDateIsPreviousDay() {
        LocalDate businessToday = LocalDate.of(2026, 9, 25);

        assertDoesNotThrow(() ->
            service.validateRange(
                LocalDate.of(2026, 9, 1),
                businessToday,
                businessToday
            )
        );
    }

    @Test
    void rejectsDateAfterBusinessToday() {
        LocalDate businessToday = LocalDate.of(2026, 9, 25);

        IllegalArgumentException exception = assertThrows(
            IllegalArgumentException.class,
            () -> service.validateRange(
                LocalDate.of(2026, 9, 1),
                LocalDate.of(2026, 9, 26),
                businessToday
            )
        );

        assertEquals("미래 날짜 선택 불가", exception.getMessage());
    }

    @Test
    void leadTimeUsesSameDateValidationPolicy() {
        LocalDate businessToday = LocalDate.now(java.time.ZoneId.of("Asia/Seoul"));

        assertThrows(
            IllegalArgumentException.class,
            () -> service.getVendorLeadTime(
                businessToday,
                businessToday.plusDays(1)
            )
        );

        verifyNoInteractions(mapper);
    }

    @Test
    void inboundPartnerRankUsesSupplierPopulationForOtherQuantity() {
        LocalDate from = LocalDate.of(2026, 9, 1);
        LocalDate to = LocalDate.of(2026, 9, 24);

        List<ClientRankRow> top = new ArrayList<>(
            List.of(new ClientRankRow("Supplier A", 60L))
        );

        when(mapper.selectInboundPartnerRankTop(from, to, 5)).thenReturn(top);
        when(mapper.sumInboundPartnerRankTotal(from, to)).thenReturn(100L);
        when(mapper.countInboundPartners(from, to)).thenReturn(2L);

        List<ClientRankRow> result = service.getInboundPartnerRank(from, to, 5);

        assertEquals(2, result.size());
        assertEquals("기타(1)", result.get(1).getName());
        assertEquals(40L, result.get(1).getQty());

        verify(mapper).sumInboundPartnerRankTotal(from, to);
        verify(mapper).countInboundPartners(from, to);
    }

    @Test
    void outboundPartnerRankUsesSellerPopulationForOtherQuantity() {
        LocalDate from = LocalDate.of(2026, 9, 1);
        LocalDate to = LocalDate.of(2026, 9, 24);

        List<ClientRankRow> top = new ArrayList<>(
            List.of(new ClientRankRow("Seller A", 70L))
        );

        when(mapper.selectOutboundPartnerRankTop(from, to, 5)).thenReturn(top);
        when(mapper.sumOutboundPartnerRankTotal(from, to)).thenReturn(120L);
        when(mapper.countOutboundPartners(from, to)).thenReturn(2L);

        List<ClientRankRow> result = service.getOutboundPartnerRank(from, to, 5);

        assertEquals(2, result.size());
        assertEquals("기타(1)", result.get(1).getName());
        assertEquals(50L, result.get(1).getQty());

        verify(mapper).sumOutboundPartnerRankTotal(from, to);
        verify(mapper).countOutboundPartners(from, to);
    }
}
