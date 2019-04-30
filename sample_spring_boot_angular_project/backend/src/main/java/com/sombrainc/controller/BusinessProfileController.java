package com.sombrainc.controller;

import com.sombrainc.dto.BusinessProfileDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.service.BusinessProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/protected/business-profile")
public class BusinessProfileController {

    @Autowired
    private BusinessProfileService businessProfileService;

    @PostMapping
    public RestMessageDTO saveBusinessProfile(@RequestBody BusinessProfileDTO businessProfileDTO) {
        return businessProfileService.saveBusinessProfile(businessProfileDTO);
    }

    @GetMapping
    public BusinessProfileDTO getBusinessProfile() {
        return businessProfileService.getBusinessProfile();
    }

    @PutMapping
    public RestMessageDTO updateBusinessProfile(@RequestBody BusinessProfileDTO businessProfileDTO) {
        return businessProfileService.editBusinessProfileByUser(businessProfileDTO);
    }

}
