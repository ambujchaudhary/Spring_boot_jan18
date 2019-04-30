package com.sombrainc.entity.enumeration;

import lombok.Getter;

import java.util.stream.Stream;

@Getter
public enum WeatherIcon {

    CLEAR_DAY("clear-day"), CLEAR_NIGHT("clear-night"), RAIN("rain"), SNOW("snow"), SLEET("sleet"), WIND("wind"), FOG("fog"), CLOUDY(
        "cloudy"), PARTLY_CLOUDY_DAY("partly-cloudy-day"), PARTLY_CLOUDY_NIGHT("partly-cloudy-night");

    private String apiName;

    WeatherIcon(String apiName) {
        this.apiName = apiName;
    }

    public static WeatherIcon of(String value) {
        return Stream
            .of(values())
            .filter(icon -> icon.getApiName().equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }
}
