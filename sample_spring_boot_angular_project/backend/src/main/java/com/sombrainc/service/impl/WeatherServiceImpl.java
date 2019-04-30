package com.sombrainc.service.impl;

import com.sombrainc.dto.ForecastDTO;
import com.sombrainc.dto.WeatherDTO;
import com.sombrainc.entity.User;
import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.WeatherIcon;
import com.sombrainc.service.UserService;
import com.sombrainc.service.WeatherService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import tk.plogitech.darksky.api.jackson.DarkSkyJacksonClient;
import tk.plogitech.darksky.forecast.*;
import tk.plogitech.darksky.forecast.model.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class WeatherServiceImpl implements WeatherService {

    @Value("darksky.key")
    private String apiKey;

    @Autowired
    private UserService userService;

    @Override
    public List<ForecastDTO> getForecast(BigDecimal latitude, BigDecimal longitude) {
        List<ForecastDTO> forecastList = new ArrayList<>();
        ForecastRequest request = new ForecastRequestBuilder()
            .key(new APIKey("907ee4b6d58c6284e8e386bd289bf601"))
            .language(ForecastRequestBuilder.Language.en)
            .exclude(ForecastRequestBuilder.Block.hourly)
            .location(new GeoCoordinates(new Longitude(longitude.doubleValue()), new Latitude(latitude.doubleValue())))
            .build();
        DarkSkyJacksonClient client = new DarkSkyJacksonClient();
        try {
            Forecast forecast = client.forecast(request);
            ForecastDTO currently = getCurrently(forecast.getCurrently(), forecast.getTimezone());
            List<ForecastDTO> weekForecast = forecast
                .getDaily()
                .getData()
                .stream()
                .map(f -> convertToForecastDTO(f, forecast.getTimezone()))
                .collect(Collectors.toList());
            forecastList = weekForecast
                .stream()
                .map(f -> f.getForecastDate().equals(currently.getForecastDate()) ? currently : f)
                .collect(Collectors.toList());
        } catch (ForecastException e) {
            LOGGER.info("Forecast retrieve failed", e);
        }
        return forecastList.subList(0, 7);
    }

    @Override
    public WeatherDTO get7DaysForecast() {
        User user = userService.getCurrentUser();
        UserProfile profile = user.getUserProfile();
        LOGGER.info("Get forecast: user - " + user.getEmail() + " city: " + profile.getAddress());
        List<ForecastDTO> forecastDTOS = getForecast(profile.getLatitude(), profile.getLongitude());
        LOGGER.info("forecastDTOS: " + Arrays.toString(forecastDTOS.toArray()));
        return WeatherDTO.builder().forecastDTOList(forecastDTOS).address(profile.getAddress()).build();
    }

    private ForecastDTO getCurrently(Currently currently, String timezone) {
        Instant instant = currently.getTime();
        int temp = currently.getTemperature().intValue();
        return ForecastDTO
            .builder()
            .forecastDate(LocalDate.ofInstant(instant, ZoneId.of(timezone)))
            .temperature(temp)
            .icon(WeatherIcon.of(currently.getIcon()))
            .build();
    }

    private ForecastDTO convertToForecastDTO(DailyDataPoint dailyDataPoint, String timezone) {
        return ForecastDTO
            .builder()
            .forecastDate(LocalDate.ofInstant(dailyDataPoint.getTime(), ZoneId.of(timezone)))
            .temperature(dailyDataPoint.getTemperatureHigh().intValue())
            .icon(WeatherIcon.of(dailyDataPoint.getIcon()))
            .build();
    }
}
