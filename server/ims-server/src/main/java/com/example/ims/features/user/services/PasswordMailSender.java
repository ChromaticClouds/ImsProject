package com.example.ims.features.user.services;

import com.example.ims.features.user.dto.PasswordChangePayload;
import com.example.ims.features.user.mail.PasswordResetMail;
import com.example.ims.global.external.resend.ResendClient;
import com.example.ims.global.properties.ResendProperties;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class PasswordMailSender {

    private final ResendClient resendClient;
    private final ResendProperties props;

    public void createPasswordChangeForm(PasswordChangePayload payload)
            throws ResendException {
        CreateEmailOptions options = CreateEmailOptions.builder()
            .from(props.getFromEmail())
            .to(payload.email())
            .subject("[IMS PROJECT] 비밀번호 재설정 안내")
            .html(new PasswordResetMail(payload.token(), props.getBaseUrl())
                .getMailContents()).build();

        resendClient.send(options);
    }
}
