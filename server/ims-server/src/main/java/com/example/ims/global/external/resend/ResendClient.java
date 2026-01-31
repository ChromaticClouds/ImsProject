package com.example.ims.global.external.resend;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.ims.global.config.ResendProperties;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.services.emails.model.CreateEmailOptions;

@Component
public class ResendClient {

    private final Resend resend;

    public ResendClient(ResendProperties props) {
        this.resend = new Resend(props.getApiKey());
    }

    public void send(CreateEmailOptions options)
            throws ResendException {
        resend.emails().send(options);
    }

    public void sendBatch(List<CreateEmailOptions> batch)
            throws ResendException {
        resend.batch().send(batch);
    }
}
