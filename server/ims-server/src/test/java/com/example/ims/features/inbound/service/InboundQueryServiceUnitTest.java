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
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.inOrder;

class InboundQueryServiceUnitTest {

    @Test
    void resolvesMappingOnceAndLocksAscendingBeforeWritingChainedDuplicateHistory() {
        InboundQueryMapper mapper = successfulMapper();
        when(mapper.selectOrdersForInboundCompleteByOrderNumber("PLA-001"))
            .thenReturn(List.of(row(1L, 101L), row(2L, 102L), row(3L, 101L)));
        when(mapper.selectProductIdByVendorItemId(101L)).thenReturn(202L);
        when(mapper.selectProductIdByVendorItemId(102L)).thenReturn(201L);
        when(mapper.markInboundCompleteByOrderNumber("PLA-001", 7L)).thenReturn(3);
        new InboundQueryService(mapper).markCompleteByOrderNumberAndWriteHistory("PLA-001", null, 7L);

        var ordered = inOrder(mapper);
        ordered.verify(mapper).selectProductIdByVendorItemId(101L);
        ordered.verify(mapper).selectProductIdByVendorItemId(102L);
        ordered.verify(mapper).ensureStockRow(201L);
        ordered.verify(mapper).selectStockCountForUpdate(201L);
        ordered.verify(mapper).ensureStockRow(202L);
        ordered.verify(mapper).selectStockCountForUpdate(202L);
        ordered.verify(mapper).insertHistoryLot(any());
        ordered.verify(mapper).updateStockCount(202L, 15);
        ordered.verify(mapper).insertHistoryRow(99L, 101L, 202L, 10, 15);
        ordered.verify(mapper).updateStockCount(201L, 15);
        ordered.verify(mapper).insertHistoryRow(99L, 102L, 201L, 10, 15);
        ordered.verify(mapper).updateStockCount(202L, 20);
        ordered.verify(mapper).insertHistoryRow(99L, 101L, 202L, 15, 20);
        ordered.verify(mapper).markInboundCompleteByOrderNumber("PLA-001", 7L);
        verify(mapper, times(1)).selectProductIdByVendorItemId(101L);
        verify(mapper, times(2)).ensureStockRow(anyLong());
        verify(mapper, times(2)).selectStockCountForUpdate(anyLong());
    }

    @Test
    void existingStockSkipsInsertAndUsesTheLockedCount() {
        InboundQueryMapper mapper = successfulMapper();
        when(mapper.selectOrdersForInboundCompleteByOrderNumber("PLA-001")).thenReturn(List.of(row(1L, 101L)));
        when(mapper.selectProductIdByVendorItemId(101L)).thenReturn(201L);
        when(mapper.stockRowExists(201L)).thenReturn(true);
        when(mapper.markInboundCompleteByOrderNumber("PLA-001", 7L)).thenReturn(1);
        new InboundQueryService(mapper).markCompleteByOrderNumberAndWriteHistory("PLA-001", null, 7L);
        verify(mapper, never()).ensureStockRow(anyLong());
        verify(mapper).selectStockCountForUpdate(201L);
        verify(mapper).updateStockCount(201L, 15);
    }

    @Test
    void invalidLaterMappingOrQuantityIsRejectedBeforeAnyStockLockOrHistoryWrite() {
        for (boolean invalidMapping : List.of(true, false)) {
            InboundQueryMapper mapper = mock(InboundQueryMapper.class);
            when(mapper.selectOrdersForInboundCompleteByOrderNumber("PLA-001"))
                .thenReturn(List.of(row(1L, 101L), row(2L, 102L)));
            when(mapper.selectOrderCountById(1L)).thenReturn(5);
            when(mapper.selectOrderCountById(2L)).thenReturn(invalidMapping ? 5 : 0);
            when(mapper.selectProductIdByVendorItemId(101L)).thenReturn(201L);
            assertThrows(IllegalArgumentException.class,
                () -> new InboundQueryService(mapper).markCompleteByOrderNumberAndWriteHistory("PLA-001", null, 7L));
            verify(mapper, never()).ensureStockRow(anyLong());
            verify(mapper, never()).insertHistoryLot(any());
            verify(mapper, never()).markQtyChangedByOrderId(anyLong());
        }
    }

    @Test
    void missingLockedStockStopsBeforeWritingHistory() {
        InboundQueryMapper mapper = mock(InboundQueryMapper.class);
        when(mapper.selectOrdersForInboundCompleteByOrderNumber("PLA-001")).thenReturn(List.of(row(1L, 101L)));
        when(mapper.selectOrderCountById(1L)).thenReturn(5);
        when(mapper.selectProductIdByVendorItemId(101L)).thenReturn(201L);
        when(mapper.selectStockCountForUpdate(201L)).thenReturn(null);
        assertThrows(IllegalStateException.class,
            () -> new InboundQueryService(mapper).markCompleteByOrderNumberAndWriteHistory("PLA-001", null, 7L));
        verify(mapper, never()).insertHistoryLot(any());
        verify(mapper, never()).updateStockCount(anyLong(), anyInt());
    }

    private InboundQueryMapper successfulMapper() {
        InboundQueryMapper mapper = mock(InboundQueryMapper.class);
        doAnswer(invocation -> {
            HistoryLot lot = invocation.getArgument(0);
            lot.setId(99L);
            return 1;
        }).when(mapper).insertHistoryLot(any());
        when(mapper.selectOrderCountById(anyLong())).thenReturn(5);
        when(mapper.selectStockCountForUpdate(anyLong())).thenReturn(10);
        when(mapper.updateStockCount(anyLong(), anyInt())).thenReturn(1);
        when(mapper.insertHistoryRow(anyLong(), anyLong(), anyLong(), anyInt(), anyInt())).thenReturn(1);
        return mapper;
    }

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
