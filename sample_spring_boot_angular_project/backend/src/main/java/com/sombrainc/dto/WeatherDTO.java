package com.sombrainc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class WeatherDTO {

    private String address;

    @JsonProperty("forecast")
    private List<ForecastDTO> forecastDTOList;
}
