package com.example.ims.features.invitation.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ims.features.invitation.Invitation;
import com.example.ims.features.invitation.dto.InvitationMailPayload;
import com.example.ims.global.config.ResendProperties;
import com.example.ims.global.external.resend.ResendClient;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitationMailSender {
    
    private final ResendClient resendClient;
    private final ResendProperties props;

    public void createInvitation(List<InvitationMailPayload> payloads) throws ResendException {
        List<CreateEmailOptions> batch = payloads.stream()
            .map(payload -> CreateEmailOptions.builder()
                .from(props.getFromEmail())
                .to(payload.getUser().getEmail())
                .subject("IMS PROJECT 초대장이 도착했습니다.")
                .html(new Invitation(payload.getToken(), props.getBaseUrl()).getMailContents())
                .build())
            .toList();

        resendClient.sendBatch(batch);
    }
}
