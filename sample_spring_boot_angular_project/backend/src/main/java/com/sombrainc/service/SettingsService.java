package com.sombrainc.service;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.SettingsDTO;
import com.sombrainc.entity.Settings;
import com.sombrainc.entity.User;

public interface SettingsService {

    Settings createSettings(User user);

    RestMessageDTO changeSettings(SettingsDTO settingsDTO);

    SettingsDTO getSettings();

}
