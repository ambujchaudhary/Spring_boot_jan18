package com.sombrainc.service.impl;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.SettingsDTO;
import com.sombrainc.entity.Settings;
import com.sombrainc.entity.User;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.SettingsRepository;
import com.sombrainc.service.SettingsService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.SettingsDTOMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SettingsServiceImpl implements SettingsService {

    private static final int DEFAULT_NEW_JOB_RADIUS = 100;

    private static final int MAX_JOB_RADIUS = 1000;

    private static final String SETTINGS_NOT_FOUND = "Settings not found";

    @Autowired
    private UserService userService;

    @Autowired
    private SettingsRepository settingsRepository;

    @Override
    public Settings createSettings(User user) {
        return Settings.builder().radius(DEFAULT_NEW_JOB_RADIUS).users(user).email(true).push(true).build();
    }

    @Override
    public RestMessageDTO changeSettings(SettingsDTO settingsDTO) {
        if (Integer.parseInt(settingsDTO.getRadius()) > MAX_JOB_RADIUS) {
            throw new BadRequest400Exception("Setting radius not supported");
        }
        User currentUser = userService.getCurrentUser();
        Settings settings = settingsRepository.findByUsers(currentUser).orElseThrow(() -> new NotFound404Exception(SETTINGS_NOT_FOUND));
        if (settings.isEmail() != settingsDTO.isEmail()) {
            settings.setEmail(settingsDTO.isEmail());
        }
        if (settings.isPush() != settingsDTO.isPush()) {
            settings.setPush(settingsDTO.isPush());
        }
        if (settings.getRadius() != Integer.parseInt(settingsDTO.getRadius())) {
            settings.setRadius(Integer.parseInt(settingsDTO.getRadius()));
        }
        settingsRepository.save(settings);
        LOGGER.info("Settings for user: {} successfully changed to: {}", currentUser.getEmail(), settingsDTO);
        return RestMessageDTO.createSuccessRestMessageDTO("Settings successfully changed");
    }

    @Override
    public SettingsDTO getSettings() {
        Settings settings = settingsRepository
            .findByUsers(userService.getCurrentUser())
            .orElseThrow(() -> new NotFound404Exception(SETTINGS_NOT_FOUND));
        return SettingsDTOMapper.INSTANCE.map(settings);
    }

}
