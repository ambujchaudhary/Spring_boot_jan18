package com.sombrainc.dto.subscription;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriptionDTO {

    private String dateFrom;

    private String dateTo;

    private String subscriptionStatus;

    private String subscriptionType;

    private int applications;

    private int jobs;

}
