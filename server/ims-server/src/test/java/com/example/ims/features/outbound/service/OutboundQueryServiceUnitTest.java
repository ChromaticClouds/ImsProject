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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.inOrder;

class OutboundQueryServiceUnitTest {

    @Test
    void locksAllDistinctProductsInAscendingOrderBeforeWritingAndChainsDuplicateHistory() {
        OutboundQueryMapper mapper = successfulMapper();
        when(mapper.selectOrdersForOutboundComplete("REC-001"))
            .thenReturn(List.of(row(1L, 202L), row(2L, 201L), row(3L, 202L)));
        when(mapper.markOutboundCompleteByOrderNumber("REC-001")).thenReturn(3);
        new OutboundQueryService(mapper).completeByOrderNumberAndWriteHistory("REC-001", null, 7L);

        var ordered = inOrder(mapper);
        ordered.verify(mapper).ensureStockRow(201L);
        ordered.verify(mapper).selectStockCountForUpdate(201L);
        ordered.verify(mapper).ensureStockRow(202L);
        ordered.verify(mapper).selectStockCountForUpdate(202L);
        ordered.verify(mapper).insertHistoryLot(any());
        ordered.verify(mapper).insertHistoryOutbound(99L, 501L, 202L, 10, 8);
        ordered.verify(mapper).updateStockCount(202L, 8);
        ordered.verify(mapper).insertHistoryOutbound(99L, 501L, 201L, 10, 8);
        ordered.verify(mapper).updateStockCount(201L, 8);
        ordered.verify(mapper).insertHistoryOutbound(99L, 501L, 202L, 8, 6);
        ordered.verify(mapper).updateStockCount(202L, 6);
        ordered.verify(mapper).markOutboundCompleteByOrderNumber("REC-001");
        verify(mapper, times(2)).ensureStockRow(anyLong());
        verify(mapper, times(2)).selectStockCountForUpdate(anyLong());
    }

    @Test
    void invalidLaterItemIsRejectedBeforeAnyStockLockOrHistoryWrite() {
        for (int invalidField = 0; invalidField < 3; invalidField++) {
            OutboundQueryMapper mapper = mock(OutboundQueryMapper.class);
            var invalid = row(2L, 202L);
            if (invalidField == 0) invalid.setProductId(null);
            if (invalidField == 1) invalid.setSellerVendorId(0L);
            if (invalidField == 2) invalid.setOrderQty(0);
            when(mapper.selectOrdersForOutboundComplete("REC-001"))
                .thenReturn(List.of(row(1L, 201L), invalid));
            assertThrows(IllegalArgumentException.class,
                () -> new OutboundQueryService(mapper).completeByOrderNumberAndWriteHistory("REC-001", null, 7L));
            verify(mapper, never()).ensureStockRow(anyLong());
            verify(mapper, never()).insertHistoryLot(any());
        }
    }

    @Test
    void missingLockedStockStopsBeforeWritingHistory() {
        OutboundQueryMapper mapper = mock(OutboundQueryMapper.class);
        when(mapper.selectOrdersForOutboundComplete("REC-001")).thenReturn(List.of(row(1L, 201L)));
        assertThrows(IllegalStateException.class,
            () -> new OutboundQueryService(mapper).completeByOrderNumberAndWriteHistory("REC-001", null, 7L));
        verify(mapper, never()).insertHistoryLot(any());
        verify(mapper, never()).updateStockCount(anyLong(), anyInt());
    }

    private OutboundQueryMapper successfulMapper() {
        OutboundQueryMapper mapper = mock(OutboundQueryMapper.class);
        doAnswer(invocation -> {
            HistoryLot lot = invocation.getArgument(0);
            lot.setId(99L);
            return 1;
        }).when(mapper).insertHistoryLot(any());
        when(mapper.selectStockCountForUpdate(anyLong())).thenReturn(10);
        when(mapper.insertHistoryOutbound(anyLong(), anyLong(), anyLong(), anyInt(), anyInt())).thenReturn(1);
        when(mapper.updateStockCount(anyLong(), anyInt())).thenReturn(1);
        return mapper;
    }

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
