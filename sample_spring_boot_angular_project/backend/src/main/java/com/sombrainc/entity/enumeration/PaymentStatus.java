package com.sombrainc.entity.enumeration;

import lombok.Getter;

import java.util.stream.Stream;
@Getter
public enum PaymentStatus {

    PAYED_OUT("Payed out"),
    FIRST_PAYMENT_FAILED("First payment failed"),
    FIRST_PAYMENT_CONFIRMED("First payment confirmed"),
    SECOND_PAYMENT_FAILED("Second payment failed"),
    FIRST_PAYMENT_CAPTURE_RETRIED("First payment capture retried"),
    SECOND_PAYMENT_CAPTURE_RETRIED("Second payment capture retried");

    private String status;

    PaymentStatus (String status) { this.status = status;}

    public static PaymentStatus of(String value) {
        return Stream
            .of(values())
            .filter(paymentStatus -> paymentStatus.getStatus().equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }
}
