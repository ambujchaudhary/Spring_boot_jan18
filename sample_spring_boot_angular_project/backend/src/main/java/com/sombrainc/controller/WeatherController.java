package com.sombrainc.controller;

import com.sombrainc.dto.WeatherDTO;
import com.sombrainc.service.WeatherService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WeatherController {

    @Autowired
    private WeatherService weatherService;

    @GetMapping("/api/protected/forecast")
    public WeatherDTO getForecast() {
        return weatherService.get7DaysForecast();
    }
}
