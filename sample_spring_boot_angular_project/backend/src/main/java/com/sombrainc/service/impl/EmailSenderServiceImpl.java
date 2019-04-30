package com.sombrainc.service.impl;

import com.sendgrid.*;
import com.sombrainc.service.EmailSenderService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Slf4j
@Service
public class EmailSenderServiceImpl implements EmailSenderService {

    @Value("${mail.smtp.noreply}")
    private String noReplyEmail;

    @Value("${sendgrid.api.key}")
    private String sendGridKey;

    @Override
    public void sendMail(final String to, final String subject, final String content) {
        Email from = new Email(noReplyEmail, "Shootzu Team");
        Email toUser = new Email(to);
        Content cont = new Content("text/html", content);
        Mail mail = new Mail(from, subject, toUser, cont);

        SendGrid sendGrid = new SendGrid(sendGridKey);
        Request request = new Request();
        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sendGrid.api(request);
            LOGGER.info("Response status: {}, body: {} and headers: {} : ", response.getStatusCode(), response.getBody(),
                response.getHeaders());
        } catch (IOException e) {
            LOGGER.error("Error message: {}", e.getMessage());
        }
    }

}
