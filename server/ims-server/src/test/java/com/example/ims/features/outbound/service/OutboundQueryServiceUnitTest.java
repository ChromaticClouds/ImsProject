package com.example.ims.features.outbound.service;

import com.example.ims.features.inbound.dto.HistoryLot;
import com.example.ims.features.outbound.dto.OutboundCompleteOrderRow;
import com.example.ims.features.outbound.mapper.OutboundQueryMapper;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class OutboundQueryServiceUnitTest {

    @Test
    void completionRejectsPartiallyUpdatedOrderGroup() {
        OutboundQueryMapper mapper = mock(OutboundQueryMapper.class);
        OutboundQueryService service = new OutboundQueryService(mapper);

        when(mapper.selectOrdersForOutboundComplete("REC-001"))
            .thenReturn(List.of(row(1L, 201L), row(2L, 202L)));
        doAnswer(invocation -> {
            HistoryLot lot = invocation.getArgument(0);
            lot.setId(99L);
            return 1;
        }).when(mapper).insertHistoryLot(any(HistoryLot.class));
        when(mapper.selectStockCountForUpdate(anyLong())).thenReturn(10);
        when(mapper.insertHistoryOutbound(anyLong(), anyLong(), anyLong(), anyInt(), anyInt()))
            .thenReturn(1);
        when(mapper.updateStockCount(anyLong(), anyInt())).thenReturn(1);
        when(mapper.markOutboundCompleteByOrderNumber("REC-001")).thenReturn(1);

        assertThrows(
            IllegalStateException.class,
            () -> service.completeByOrderNumberAndWriteHistory("REC-001", null, 7L)
        );
    }

    private OutboundCompleteOrderRow row(Long orderId, Long productId) {
        OutboundCompleteOrderRow row = new OutboundCompleteOrderRow();
        row.setOrderId(orderId);
        row.setProductId(productId);
        row.setSellerVendorId(501L);
        row.setOrderQty(2);
        return row;
    }
}
