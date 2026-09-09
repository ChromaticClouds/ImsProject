package com.example.ims.features.inbound.service;

import com.example.ims.features.inbound.dto.HistoryLot;
import com.example.ims.features.inbound.dto.InboundCompleteOrderRow;
import com.example.ims.features.inbound.mapper.InboundQueryMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class InboundQueryServiceUnitTest {

    @Test
    void completionRejectsPartiallyUpdatedOrderGroup() {
        InboundQueryMapper mapper = mock(InboundQueryMapper.class);
        InboundQueryService service = new InboundQueryService(mapper);

        when(mapper.selectOrdersForInboundCompleteByOrderNumber("PLA-001"))
            .thenReturn(List.of(row(1L, 101L), row(2L, 102L)));
        doAnswer(invocation -> {
            HistoryLot lot = invocation.getArgument(0);
            lot.setId(99L);
            return 1;
        }).when(mapper).insertHistoryLot(any(HistoryLot.class));
        when(mapper.selectOrderCountById(anyLong())).thenReturn(5);
        when(mapper.selectProductIdByVendorItemId(101L)).thenReturn(201L);
        when(mapper.selectProductIdByVendorItemId(102L)).thenReturn(202L);
        when(mapper.selectStockCountForUpdate(anyLong())).thenReturn(10);
        when(mapper.updateStockCount(anyLong(), anyInt())).thenReturn(1);
        when(mapper.insertHistoryRow(anyLong(), anyLong(), anyLong(), anyInt(), anyInt()))
            .thenReturn(1);
        when(mapper.markInboundCompleteByOrderNumber("PLA-001", 7L)).thenReturn(1);

        assertThrows(
            IllegalStateException.class,
            () -> service.markCompleteByOrderNumberAndWriteHistory("PLA-001", null, 7L)
        );
    }

    private InboundCompleteOrderRow row(Long orderId, Long vendorItemId) {
        InboundCompleteOrderRow row = new InboundCompleteOrderRow();
        row.setOrderId(orderId);
        row.setVendorItemId(vendorItemId);
        row.setOrderQty(5);
        return row;
    }
}
