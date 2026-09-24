package com.example.ims.features.statistics.services;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verifyNoInteractions;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

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

        org.junit.jupiter.api.Assertions.assertEquals(
            "미래 날짜 선택 불가",
            exception.getMessage()
        );
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
}
