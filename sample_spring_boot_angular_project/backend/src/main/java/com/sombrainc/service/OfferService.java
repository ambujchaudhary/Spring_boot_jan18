package com.sombrainc.service;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.entity.Offer;
import com.sombrainc.entity.enumeration.PaymentStatus;

public interface OfferService {

    RestMessageDTO createOfferWithStripe(Long jobId, Long profileId, String token, boolean fullCharge);

    RestMessageDTO declineOffer(Long jobId);

    RestMessageDTO acceptOffer (Long jobId);

    String createOfferWithGoCardless(final Long jobId,final Long profileId, final String successRedirectUrl);

    RestMessageDTO completeGoCardlessRedirectFlow(final Long jobId,final Long profileId, final String redirectFlowId, final Boolean isCompleted);

    void changeOfferPaymentStatus(Offer offer, PaymentStatus paymentStatus);

}
