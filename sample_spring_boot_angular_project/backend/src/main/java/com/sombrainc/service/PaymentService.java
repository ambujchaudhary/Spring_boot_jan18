package com.sombrainc.service;

import com.gocardless.resources.Event;
import org.springframework.http.ResponseEntity;

import java.math.BigDecimal;

public interface PaymentService {

    String createStripeCharge(BigDecimal pricePerHour, BigDecimal numberOfHours, String description, String customerId,
        boolean fullAmountCharge, String ownerEmail);

    void createRefund(String chargeId);

    void handleGoCardlessEvent(Event event);

    String createGoCardlessClientForRedirectFlow(String successRedirectUrl);

    String createPaymentWithGoCardless(final String goCardlessMandateId, final BigDecimal pricePerHour, final BigDecimal numberOfHours);

    String completeGoCardlessRedirectFlow(final String redirectId);

    String createStripeCustomer(final String token);

    void retryGoCardlessPayment(final String paymentId);

    void handleGoCardlessMandateCreatingFailure(final String mandateId);

    void handleGoCardlessPaymentFailure(final String paymentId);

    void handleGoCardlessPaymentSuccess(final String paymentId);

    ResponseEntity<String> handleGoCardlessEvent(String signatureHeader, String webhookBody);

}
