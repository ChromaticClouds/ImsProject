package com.example.ims.features.invitation.services;

import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.ims.features.invitation.dto.EmailRequest;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;

@Service
public class InvitationService {

    @Value("${resend.api-key}")
    private String resendApiKey;

    public void invite(EmailRequest request) throws ResendException {
        List<String> emails = request.getEmails();

        Resend resend = new Resend(resendApiKey);
        List<CreateEmailOptions> paramList = emails.stream().map(email -> CreateEmailOptions.builder()
            .from("noreply@resend.dev")
            .to(email)
            .subject("Hello!!!")
            .html(UUID.randomUUID().toString())
            .build()).toList();

        for (CreateEmailOptions param: paramList) {
            resend.emails().send(param);
        }
    }
}
