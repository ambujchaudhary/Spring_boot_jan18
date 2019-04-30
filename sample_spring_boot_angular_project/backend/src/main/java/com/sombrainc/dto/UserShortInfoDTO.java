package com.sombrainc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sombrainc.dto.profile.UserProfileInfoDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserShortInfoDTO {

    @JsonProperty("businessProfileData")
    private BusinessProfileDTO businessProfileDTO;

    @JsonProperty("userProfileData")
    private UserProfileInfoDTO userProfileInfoDTO;

}
