package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.order.enums.OrderStatus;
import com.example.ims.features.order.repositories.OrderRepository;
import com.example.ims.features.purchaseorder.dto.LoadGroupResult;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.purchaseorder.exception.PurchaseOrderAlreadySentException;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.features.vendor.entities.VendorItem;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class PurchaseOrderLoaderUnitTest {

    @Mock OrderRepository orderRepository;

    @Test
    void unsentOrderBuildsContext() {
        PurchaseOrderLoader loader = new PurchaseOrderLoader(orderRepository);
        when(orderRepository.findAllByOrderNumber("PLA-1"))
            .thenReturn(List.of(order(1L, "PLA-1", null)));

        PurchaseOrderContext context = loader.load("PLA-1");

        assertEquals("PLA-1", context.orderNumber());
        assertEquals(1, context.orders().size());
    }

    @Test
    void alreadySentOrderIsRejectedWithConflict() {
        PurchaseOrderLoader loader = new PurchaseOrderLoader(orderRepository);
        when(orderRepository.findAllByOrderNumber("PLA-1"))
            .thenReturn(List.of(order(1L, "PLA-1", OrderStatus.INBOUND_PENDING)));

        PurchaseOrderAlreadySentException exception =
            assertThrows(PurchaseOrderAlreadySentException.class, () -> loader.load("PLA-1"));

        assertEquals(HttpStatus.CONFLICT, exception.getHttpStatus());
    }

    @Test
    void partiallySentOrderIsAlsoRejected() {
        PurchaseOrderLoader loader = new PurchaseOrderLoader(orderRepository);
        when(orderRepository.findAllByOrderNumber("PLA-1")).thenReturn(List.of(
            order(1L, "PLA-1", null),
            order(2L, "PLA-1", OrderStatus.INBOUND_PENDING)
        ));

        assertThrows(PurchaseOrderAlreadySentException.class, () -> loader.load("PLA-1"));
    }

    @Test
    void groupLoadReportsSentOrderAndKeepsUnsentOne() {
        PurchaseOrderLoader loader = new PurchaseOrderLoader(orderRepository);
        when(orderRepository.findAllByOrderNumberIn(List.of("PLA-1", "PLA-2"))).thenReturn(List.of(
            order(1L, "PLA-1", null),
            order(2L, "PLA-2", OrderStatus.INBOUND_COMPLETE)
        ));

        LoadGroupResult result = loader.loadGroup(List.of("PLA-1", "PLA-2"));

        assertEquals(1, result.contexts().size());
        assertEquals("PLA-1", result.contexts().getFirst().orderNumber());
        assertEquals(1, result.failed().size());
        assertEquals("PLA-2", result.failed().getFirst().orderNumber());
        assertEquals("이미 전송된 발주서입니다.", result.failed().getFirst().reason());
    }

    private Order order(Long id, String orderNumber, OrderStatus status) {
        User user = new User();
        user.setId(1L);
        user.setName("담당자");

        Vendor vendor = Vendor.builder()
            .id(1L)
            .vendorName("공급처")
            .email("vendor@example.com")
            .build();

        VendorItem vendorItem = new VendorItem();
        vendorItem.setVendor(vendor);

        return Order.builder()
            .id(id)
            .user(user)
            .orderNumber(orderNumber)
            .recieveDate(LocalDate.now(ZoneId.of("Asia/Seoul")).plusDays(3))
            .count(5)
            .status(status)
            .vendorItem(vendorItem)
            .build();
    }
}
