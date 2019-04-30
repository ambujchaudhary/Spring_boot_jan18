package com.sombrainc.entity.enumeration;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum JobStatus {

    NEW("New"), WAITING_FOR_RESPONSE("Waiting for response"), OFFER_ACCEPTED("Offer accepted"), IN_PROGRESS("In progress"), COMPLETED(
        "Completed"), DONE("Done"), CANCELLED("Cancelled");

    private String status;

    JobStatus(String status) {
        this.status = status;
    }

    public static JobStatus of(String value) {
        return Stream
            .of(values())
            .filter(jobStatus -> jobStatus.getStatus().equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(IllegalAccessError::new);
    }

}