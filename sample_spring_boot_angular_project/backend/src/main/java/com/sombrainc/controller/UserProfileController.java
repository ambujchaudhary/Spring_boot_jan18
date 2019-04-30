package com.sombrainc.controller;

import com.sombrainc.dto.*;
import com.sombrainc.dto.profile.*;
import com.sombrainc.service.UserProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @PostMapping("/api/protected/profiles")
    public RestMessageDTO save(@RequestBody UserProfileDTO userProfileDTO) {
        return userProfileService.saveProfile(userProfileDTO);
    }

    @PostMapping("/api/protected/profiles/later")
    public RestMessageDTO saveForLater(@RequestBody UserProfileDTO userProfileDTO) {
        return userProfileService.saveForLater(userProfileDTO);
    }

    @GetMapping("/api/private/users/{id}/profiles")
    public UserProfileAndBusinessViewDTO getUserProfileForAdmin(@PathVariable(value = "id") final Long userId) {
        return userProfileService.getUserProfileForAdmin(userId);
    }

    @GetMapping("/api/private/users/{id}")
    public UserInfoDTO getUserInfoForAdmin(@PathVariable(value = "id") final Long userId) {
        return userProfileService.getUserInfoForAdmin(userId);
    }

    @PutMapping("/api/private/users/{id}")
    public RestMessageDTO editUserInfoAdmin(@PathVariable(value = "id") final Long userId, @RequestBody UserShortInfoDTO userShortInfoDTO) {
        return userProfileService.editUserInfoByAdmin(userId, userShortInfoDTO);
    }

    @GetMapping("/api/protected/profiles/{id}")
    public UserProfileViewDTO getUserProfileForBusiness(@PathVariable(value = "id") final Long profileId) {
        return userProfileService.getUserProfileForBusiness(profileId);
    }

    @GetMapping("/api/private/profiles")
    public UserManagementDTO getUserProfilesForAdmin() {
        return userProfileService.getAllProfiles();
    }

    @PutMapping("/api/private/users/{id}/profiles/success")
    public RestMessageDTO userProfileVerificationSuccess(@PathVariable(value = "id") final Long userId) {
        return userProfileService.userProfileVerificationSuccess(userId);
    }

    @PutMapping(value = "api/private/users/{id}/profiles/failed")
    public RestMessageDTO userProfileVerificationFailed(@PathVariable(value = "id") final Long userId,
        @RequestBody Map<String, String> comment) {
        return userProfileService.userProfileVerificationFailed(userId, comment.get("comment"));
    }

    @PutMapping("/api/protected/profiles")
    public RestMessageDTO editProfile(@RequestBody UserProfileDTO userProfileDTO) {
        return userProfileService.editProfile(userProfileDTO);
    }

    @GetMapping("/api/protected/profiles")
    public UserProfileWithCommentDTO userProfileWithComment() {
        return userProfileService.getUserProfileWithComment();
    }

    @GetMapping("/api/protected/profile-names")
    public ProfileNamesDTO getProfileNames() {
        return userProfileService.getProfileNames();
    }

    @GetMapping("/api/protected/users/{id}/profiles")
    public UserProfileIdDTO getUserProfileId(@PathVariable(value = "id") final Long userId) {
        return userProfileService.getProfileId(userId);
    }
}
