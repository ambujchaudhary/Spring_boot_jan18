package com.sombrainc.entity.enumeration;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum SubscriptionType {

    FREE("free"),
    MONTHLY("monthly"),
    ANNUAL("shootzu-annual-membership");

    private String plan;

    SubscriptionType(String plan) {
        this.plan = plan;
    }

    public static SubscriptionType of(String plan) {
        return Stream
            .of(values())
            .filter(subscriptionType -> subscriptionType.getPlan().equalsIgnoreCase(plan))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }
}
