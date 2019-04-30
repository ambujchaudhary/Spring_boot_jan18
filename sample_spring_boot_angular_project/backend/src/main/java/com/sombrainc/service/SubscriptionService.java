package com.sombrainc.service;

import com.chargebee.models.Event;
import com.sombrainc.dto.HostedPageDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.subscription.CancelSubscriptionDTO;
import com.sombrainc.dto.subscription.SubscriptionDTO;

import java.util.List;

public interface SubscriptionService {

    void handleApplication();

    void handlePostJob();

    RestMessageDTO createSubscription(HostedPageDTO hostedPageDTO);

    RestMessageDTO downgradeToFree();

    RestMessageDTO createNewFreeSubscription();

    void handleWebhookEvent(Event event);

    List<SubscriptionDTO> getSubscriptionInfo();

    String openPortalSession();

    String createNewChargebeeCheckout(String planId);

    String createExistingChargebeeCheckout(String planId);

    RestMessageDTO cancelSubscription(CancelSubscriptionDTO cancelSubscriptionDTO);

    boolean hasReachedLimit(String email);

    void updateCancel();

    void setDateFrom();
}
