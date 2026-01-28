package com.example.ims.features.invitation.services;

import java.time.Duration;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.example.ims.features.invitation.dto.EmailRequest;
import com.example.ims.features.invitation.stores.InvitationTokenStore;
import com.example.ims.global.config.ResendProperties;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class InvitationService {

    private static final Duration INVITE_TTL = Duration.ofMinutes(5);

    private final InvitationTokenStore tokenStore;
    private final ResendProperties props;

    public void invite(EmailRequest request) throws ResendException {
        List<String> emails = request.getEmails();

        Resend resend = new Resend(props.getApiKey());

        for (String email: emails) {
            String token = UUID.randomUUID().toString();
            tokenStore.save(token, email, INVITE_TTL);
            sendInvite(resend, email, token);
        }
    }

    public void sendInvite(Resend resend, String email, String token) throws ResendException {
        CreateEmailOptions param = CreateEmailOptions.builder()
            .from(props.getFromEmail())
            .to(email)
            .subject("Get the code!")
            .html(token)
            .build();

        resend.emails().send(param);
    }
}
