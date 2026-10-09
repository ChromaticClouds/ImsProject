package com.example.ims.global.external.resend;

import java.util.List;

import org.springframework.stereotype.Component;

import com.example.ims.global.properties.ResendProperties;
import com.resend.Resend;
import com.resend.core.exception.ResendException;
import com.resend.core.net.RequestOptions;
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

    /**
     * 같은 멱등 키로 다시 호출하면 메일 제공자가 새 메일을 만들지 않는다.
     * 재시도나 동시 요청으로 같은 메일이 두 번 나가는 것을 막는다.
     */
    public void send(CreateEmailOptions options, String idempotencyKey)
            throws ResendException {
        RequestOptions requestOptions = RequestOptions.builder()
            .setIdempotencyKey(idempotencyKey)
            .build();
        resend.emails().send(options, requestOptions);
    }

    public void sendBatch(List<CreateEmailOptions> batch)
            throws ResendException {
        resend.batch().send(batch);
    }
}
