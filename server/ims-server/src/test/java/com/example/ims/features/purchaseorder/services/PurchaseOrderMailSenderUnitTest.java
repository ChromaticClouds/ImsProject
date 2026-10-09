package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.auth.entities.User;
import com.example.ims.features.order.entities.Order;
import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.features.vendor.dto.Vendor;
import com.example.ims.global.external.resend.ResendClient;
import com.example.ims.global.properties.ResendProperties;
import com.resend.services.emails.model.CreateEmailOptions;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class PurchaseOrderMailSenderUnitTest {

    @Test
    void sendPassesContentDerivedIdempotencyKeyToResend() throws Exception {
        ResendProperties props = mock(ResendProperties.class);
        ResendClient resendClient = mock(ResendClient.class);
        when(props.getFromEmail()).thenReturn("noreply@example.com");
        PurchaseOrderMailSender sender = new PurchaseOrderMailSender(props, resendClient);
        PurchaseOrderContext context = context("PLA-1", "vendor@example.com", 5);

        sender.sendPurchaseOrder(context, "<p>body</p>", new byte[] {1, 2, 3});

        ArgumentCaptor<String> key = ArgumentCaptor.forClass(String.class);
        verify(resendClient).send(any(CreateEmailOptions.class), key.capture());
        assertEquals(PurchaseOrderMailSender.idempotencyKey(context), key.getValue());
        assertTrue(key.getValue().startsWith("po-PLA-1-"));
    }

    @Test
    void sameContentGivesSameKeyEvenWhenOrderRowsAreReordered() {
        PurchaseOrderContext a = context("PLA-1", "vendor@example.com", 5, 7);
        PurchaseOrderContext b = reordered(a);

        assertEquals(
            PurchaseOrderMailSender.idempotencyKey(a),
            PurchaseOrderMailSender.idempotencyKey(b)
        );
    }

    @Test
    void changedQuantityGivesDifferentKeySoEditedOrderCanBeSentAgain() {
        PurchaseOrderContext original = context("PLA-1", "vendor@example.com", 5);
        PurchaseOrderContext edited = context("PLA-1", "vendor@example.com", 6);

        assertNotEquals(
            PurchaseOrderMailSender.idempotencyKey(original),
            PurchaseOrderMailSender.idempotencyKey(edited)
        );
    }

    @Test
    void changedVendorEmailGivesDifferentKey() {
        assertNotEquals(
            PurchaseOrderMailSender.idempotencyKey(context("PLA-1", "a@example.com", 5)),
            PurchaseOrderMailSender.idempotencyKey(context("PLA-1", "b@example.com", 5))
        );
    }

    private PurchaseOrderContext context(String orderNumber, String vendorEmail, int... counts) {
        Vendor vendor = Vendor.builder().id(1L).email(vendorEmail).build();
        List<Order> orders = new java.util.ArrayList<>();
        for (int i = 0; i < counts.length; i++) {
            orders.add(Order.builder().id((long) (i + 1)).orderNumber(orderNumber).count(counts[i]).build());
        }
        return new PurchaseOrderContext(new User(), orderNumber, vendor, "2026.12.31", orders);
    }

    private PurchaseOrderContext reordered(PurchaseOrderContext source) {
        List<Order> reversed = new java.util.ArrayList<>(source.orders());
        java.util.Collections.reverse(reversed);
        return new PurchaseOrderContext(
            source.user(), source.orderNumber(), source.vendor(), source.receiveDate(), reversed
        );
    }
}
