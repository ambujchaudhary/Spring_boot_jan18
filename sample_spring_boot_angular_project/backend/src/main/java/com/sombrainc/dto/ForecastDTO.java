package com.sombrainc.dto;

import com.sombrainc.entity.enumeration.WeatherIcon;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class ForecastDTO {

    private int temperature;

    private LocalDate forecastDate;

    private WeatherIcon icon;
}
