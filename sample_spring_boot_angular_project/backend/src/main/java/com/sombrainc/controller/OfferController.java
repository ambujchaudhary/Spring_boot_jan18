package com.sombrainc.controller;

import com.sombrainc.dto.*;
import com.sombrainc.service.OfferService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class OfferController {

    @Autowired
    private OfferService offerService;

    @PutMapping("/api/protected/jobs/{id}/offers/accept")
    public RestMessageDTO acceptOffer(@PathVariable("id") Long id) {
        return offerService.acceptOffer(id);
    }

    @PutMapping("/api/protected/jobs/{id}/offers/decline")
    public RestMessageDTO declineOffer(@PathVariable("id") Long id) {
        return offerService.declineOffer(id);
    }

    @PostMapping("/api/protected/jobs/{jobId}/profiles/{profileId}/offers")
    public RestMessageDTO sendOffer(@PathVariable(value = "jobId") Long jobId, @PathVariable(value = "profileId") Long profileId,
        @RequestBody StripeTokenDTO stripeTokenDTO) {
        return offerService.createOfferWithStripe(jobId, profileId, stripeTokenDTO.getToken(), stripeTokenDTO.isFullCharge());
    }

    @PostMapping("/api/protected/jobs/{jobId}/profiles/{profileId}/offersGoCardless")
    public ResponseEntity<GoCardlessRedirectURLDTO> sendOfferWithGoCardless(@PathVariable(value = "jobId") Long jobId,
        @PathVariable(value = "profileId") Long profileId, @RequestBody GoCardlessRedirectDTO goCardlessRedirectDTO) {
        final String redirectURL = offerService.createOfferWithGoCardless(jobId, profileId, goCardlessRedirectDTO.getSuccessRedirectUrl());
        GoCardlessRedirectURLDTO goCardlessRedirectURLDTO = new GoCardlessRedirectURLDTO();
        goCardlessRedirectURLDTO.setRedirectURL(redirectURL);
        return new ResponseEntity<>(goCardlessRedirectURLDTO, HttpStatus.CREATED);
    }

    @PostMapping("/api/protected/jobs/{jobId}/profiles/{profileId}/compeleteGoCardlessRedirectFlow")
    public RestMessageDTO sendOfferWithGoCardless(@PathVariable(value = "jobId") Long jobId,
        @PathVariable(value = "profileId") Long profileId,
        @RequestBody GoCardlessCompleteRedirectFlowDTO goCardlessCompleteRedirectFlowDTO) {
        return offerService.completeGoCardlessRedirectFlow(jobId, profileId, goCardlessCompleteRedirectFlowDTO.getRedirectFlowId(),
            goCardlessCompleteRedirectFlowDTO.getIsCompleted());
    }

}

