package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.global.external.resend.ResendClient;
import com.example.ims.global.properties.ResendProperties;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.HexFormat;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PurchaseOrderMailSender {

    private final ResendProperties props;
    private final ResendClient resendClient;

    public void sendPurchaseOrder(
        PurchaseOrderContext context,
        String htmlBody,
        byte[] pdfBytes
    ) throws ResendException {
        String encoded = Base64.getEncoder().encodeToString(pdfBytes);

        Attachment attachment = Attachment.builder()
            .fileName(context.orderNumber() + ".pdf")
            .content(encoded)
            .build();

        CreateEmailOptions options = CreateEmailOptions.builder()
            .from(props.getFromEmail())
            .to(context.vendor().getEmail())
            .subject("[발주서]" + context.orderNumber())
            .html(htmlBody)
            .attachments(attachment)
            .build();

        resendClient.send(options, idempotencyKey(context));
    }

    /**
     * 발주번호와 발송 내용(수신처, 납기일, 항목·수량)으로 만든 멱등 키.
     * 내용이 바뀌면 키도 바뀌어 수정 후 재발송은 막지 않는다.
     */
    static String idempotencyKey(PurchaseOrderContext context) {
        String lines = context.orders().stream()
            .map(order -> order.getId() + ":" + order.getCount())
            .sorted()
            .collect(Collectors.joining("|"));

        String material = String.join("|",
            context.orderNumber(),
            String.valueOf(context.receiveDate()),
            String.valueOf(context.vendor().getEmail()),
            lines
        );

        return "po-" + context.orderNumber() + "-" + sha256Hex(material).substring(0, 16);
    }

    private static String sha256Hex(String value) {
        try {
            byte[] digest = MessageDigest.getInstance("SHA-256")
                .digest(value.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(digest);
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256을 사용할 수 없습니다.", e);
        }
    }
}
