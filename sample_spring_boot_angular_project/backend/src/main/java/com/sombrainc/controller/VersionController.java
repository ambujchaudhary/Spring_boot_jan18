package com.sombrainc.controller;

import com.sombrainc.dto.RestMessageDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import springfox.documentation.annotations.ApiIgnore;

@ApiIgnore
@RestController
public class VersionController {

    @Value("${shootzu.app.version}")
    private String applicationVersion;

    @GetMapping("/api/public/version")
    public RestMessageDTO getApplicationVersion() {
        return RestMessageDTO.createSuccessRestMessageDTO(applicationVersion);
    }
}
