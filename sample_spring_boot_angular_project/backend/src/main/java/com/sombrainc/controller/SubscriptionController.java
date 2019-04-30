package com.sombrainc.controller;

import com.sombrainc.dto.HostedPageDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.subscription.CancelSubscriptionDTO;
import com.sombrainc.dto.subscription.SubscriptionDTO;
import com.sombrainc.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PutMapping("/api/protected/subscriptions/cancel")
    public RestMessageDTO cancelSubscription(@RequestBody CancelSubscriptionDTO cancelSubscriptionDTO) {
        return subscriptionService.cancelSubscription(cancelSubscriptionDTO);
    }

    @GetMapping("/api/protected/subscriptions")
    public List<SubscriptionDTO> getSubscriptionInfo() {
        return subscriptionService.getSubscriptionInfo();
    }

    @PostMapping("/api/protected/subscriptions/portal")
    public String openSession() {
        return subscriptionService.openPortalSession();
    }

    @PostMapping("/api/protected/subscriptions/checkout/new")
    public String createNewCheckout(@RequestParam(value = "plan_id") String planId) {
        return subscriptionService.createNewChargebeeCheckout(planId);
    }

    @PostMapping("/api/protected/subscriptions/checkout")
    public String createCheckout(@RequestParam(value = "plan_id") String planId) {
        return subscriptionService.createExistingChargebeeCheckout(planId);
    }

    @GetMapping("/api/protected/subscriptions/free")
    public RestMessageDTO createFreeSubscription() {
        return subscriptionService.downgradeToFree();
    }

    @GetMapping("/api/protected/subscriptions/free/new")
    public RestMessageDTO createNewFreeSubscription() {
        return subscriptionService.createNewFreeSubscription();
    }

    @PostMapping("/api/protected/subscriptions")
    public RestMessageDTO createSubscription(@RequestBody HostedPageDTO hostedPageDTO) {
        return subscriptionService.createSubscription(hostedPageDTO);
    }

    @GetMapping("/api/public/update")
    public void updateCancel() {
        subscriptionService.updateCancel();
    }

    @GetMapping("/api/public/update-date")
    public void updateDateFrom() {
        subscriptionService.setDateFrom();
    }
}
