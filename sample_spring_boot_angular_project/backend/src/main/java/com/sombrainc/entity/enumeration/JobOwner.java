package com.sombrainc.entity.enumeration;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum JobOwner {

    PERSONAL_NAME("Personal Name"), BUSINESS_NAME("Business Name");

    private final String name;

    JobOwner(String name) {
        this.name = name;
    }

    public static JobOwner of(String value) {
        return Stream
            .of(values())
            .filter(jobOwner -> jobOwner.getName().equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }

}
