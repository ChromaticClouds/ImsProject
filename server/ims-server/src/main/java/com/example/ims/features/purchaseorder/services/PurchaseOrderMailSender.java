package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.dto.PurchaseOrderContext;
import com.example.ims.global.external.resend.ResendClient;
import com.example.ims.global.properties.ResendProperties;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.Attachment;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Base64;

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

        resendClient.send(options);
    }
}
