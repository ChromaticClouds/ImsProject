package com.example.ims.features.invitation.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.ims.features.auth.entities.User;
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

    public void createInvitation(List<User> users) throws ResendException {
        List<CreateEmailOptions> batch = users.stream()
            .map(user -> CreateEmailOptions.builder()
                .from(props.getFromEmail())
                .to(user.getEmail())
                .subject("Get the code!")
                .html("anything")
                .build())
            .toList();

        resendClient.sendBatch(batch);
    }
}
