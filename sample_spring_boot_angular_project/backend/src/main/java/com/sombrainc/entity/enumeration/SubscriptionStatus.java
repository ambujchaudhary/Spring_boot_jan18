package com.sombrainc.entity.enumeration;

import lombok.Getter;

@Getter
public enum SubscriptionStatus {

    ACTIVE,
    NON_RENEWING,
    CANCELLED,
    FUTURE,
    IN_TRIAL
}
