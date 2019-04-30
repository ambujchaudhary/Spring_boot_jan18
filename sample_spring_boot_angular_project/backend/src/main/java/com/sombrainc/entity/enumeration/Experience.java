package com.sombrainc.entity.enumeration;

import java.util.stream.Stream;

import lombok.Getter;

@Getter
public enum Experience {

    BEGINNER("0-1 Year"), INTERMEDIATE("1-2 Years"), SOLID("2-5 Years"), ADVANCE("5-10 Years"), MASTER("10+ Years");

    private String years;

    Experience(String years) {
        this.years = years;
    }

    public static Experience of(String value) {
        return Stream
            .of(values())
            .filter(experience -> experience.getYears().equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }
}
