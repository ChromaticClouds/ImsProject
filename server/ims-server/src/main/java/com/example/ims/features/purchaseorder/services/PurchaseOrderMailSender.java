package com.example.ims.features.purchaseorder.services;

import com.example.ims.features.purchaseorder.dto.PurchaseOrderPdfContent;
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
        String to,
        String subject,
        String htmlBody,
        byte[] pdfBytes,
        String fileName
    ) throws ResendException {
        String encoded = Base64.getEncoder().encodeToString(pdfBytes);

        Attachment attachment = Attachment.builder()
            .fileName(fileName)
            .content(encoded)
            .build();

        CreateEmailOptions options = CreateEmailOptions.builder()
            .from(props.getFromEmail())
            .to(to)
            .subject(subject)
            .html(htmlBody)
            .attachments(attachment)
            .build();

        resendClient.send(options);
    }
}
