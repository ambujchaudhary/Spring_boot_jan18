package com.sombrainc.service;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.Offer;
import com.sombrainc.entity.User;

import java.math.BigDecimal;

public interface EmailService {

    void sendConfirmForgotPasswordEmail(final User user, final String link);

    void sendNotificationEmailToAdmin();

    void sendRefundEmailToAdmin(String paymentId, String mandateId, BigDecimal amount);

    void sendVerificationSuccessEmail(final User user);

    void sendVerificationFailedEmail(final User user);

    void sendJobOfferSentEmail(final User user, final Job job);

    void sendJobOfferAcceptedEmail(final User user, final Job job);

    void sendJobOfferDeclinedEmail(final Offer offer);

    void sendJobOfferExpiredEmail(final Offer offer);

    void sendCompleteJobEmail(final Job job);

    void sendJobExpiring(final Job job);

    void sendJobAlertEmail(Job job, String userEmail);

    void sendJobOfferPayedOutEmail(final User user, final Offer offer);

    void sendNewMessageEmail(String userEmail);
}
