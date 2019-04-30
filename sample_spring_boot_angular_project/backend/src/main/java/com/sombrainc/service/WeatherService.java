package com.sombrainc.service;

import com.sombrainc.dto.ForecastDTO;
import com.sombrainc.dto.WeatherDTO;

import java.math.BigDecimal;
import java.util.List;

public interface WeatherService {

    List<ForecastDTO> getForecast(BigDecimal latitude, BigDecimal longitude);

    WeatherDTO get7DaysForecast();
}
