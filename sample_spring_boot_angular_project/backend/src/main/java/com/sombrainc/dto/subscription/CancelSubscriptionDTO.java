package com.sombrainc.dto.subscription;

import com.sombrainc.entity.enumeration.SubscriptionType;
import lombok.Getter;

@Getter
public class CancelSubscriptionDTO {

    SubscriptionType subscriptionType;
}
