package com.sombrainc.service;

import com.sombrainc.dto.*;
import com.sombrainc.dto.profile.*;

public interface UserProfileService {

    RestMessageDTO saveProfile(UserProfileDTO profile);

    UserProfileAndBusinessViewDTO getUserProfileForAdmin(Long userId);

    UserInfoDTO getUserInfoForAdmin(Long userId);

    RestMessageDTO editUserInfoByAdmin(Long user, UserShortInfoDTO userShortInfoDTO);

    UserProfileViewDTO getUserProfileForBusiness(Long profileId);

    UserManagementDTO getAllProfiles();

    RestMessageDTO userProfileVerificationSuccess(Long profileId);

    RestMessageDTO saveForLater(UserProfileDTO userProfileDTO);

    RestMessageDTO editProfile(UserProfileDTO profileDTO);

    UserProfileWithCommentDTO getUserProfileWithComment();

    RestMessageDTO userProfileVerificationFailed(Long id, String comment);

    ProfileNamesDTO getProfileNames();

    UserProfileIdDTO getProfileId(Long jobId);
}
