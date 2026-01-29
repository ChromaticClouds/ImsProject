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

    private static final Duration INVITE_TTL 
        = Duration.ofMinutes(5);

    private final InvitationTokenStore tokenStore;
    private final ResendProperties props;

    public void invite(EmailRequest request) throws ResendException {
        Resend resend = new Resend(props.getApiKey());

        List<CreateEmailOptions> batch = request.getEmails()
            .stream()
            .map(email -> {
                String token = UUID.randomUUID().toString();
                tokenStore.save(token, email, INVITE_TTL);
                return getEmailOptions(resend, email, token);
            }).toList();

        resend.batch().send(batch);
    }

    public CreateEmailOptions getEmailOptions(
            Resend resend, String email, String token) {
        return CreateEmailOptions.builder()
            .from(props.getFromEmail())
            .to(email)
            .subject("Get the code!")
            .html(token)
            .build();
    }
}
