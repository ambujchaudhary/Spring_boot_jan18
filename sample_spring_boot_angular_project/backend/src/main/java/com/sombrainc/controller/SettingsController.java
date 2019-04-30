package com.sombrainc.controller;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.SettingsDTO;
import com.sombrainc.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SettingsController {

    @Autowired
    private SettingsService settingsService;

    @PutMapping("/api/protected/settings")
    public RestMessageDTO changeSettings(@RequestBody SettingsDTO settingsDTO) {
        return settingsService.changeSettings(settingsDTO);
    }

    @GetMapping("/api/protected/settings")
    public SettingsDTO getSettings() {
        return settingsService.getSettings();
    }

}
