package com.sombrainc.controller;

import com.chargebee.models.Event;
import com.sombrainc.service.PaymentService;
import com.sombrainc.service.SubscriptionService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RestController;
import springfox.documentation.annotations.ApiIgnore;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;

@Slf4j
@ApiIgnore
@RestController
public class WebhookController {

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/api/public/subscriptions/webhook")
    public ResponseEntity handleRenewedSubscription(HttpServletRequest request) throws IOException {
        Event event = new Event(request.getReader());
        LOGGER.warn(event.eventType().toString());
        LOGGER.info(event.content().toString());
        subscriptionService.handleWebhookEvent(event);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/api/public/payments/webhook")
    public ResponseEntity<String> handleGoCardlessWebhook(@RequestHeader("Webhook-Signature") String signatureHeader,
        @RequestBody String webhookBody) {
        return paymentService.handleGoCardlessEvent(signatureHeader, webhookBody);
    }
}
