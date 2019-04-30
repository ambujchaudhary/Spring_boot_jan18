package com.sombrainc.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sombrainc.dto.LocationDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileInfoDTO {

    @JsonProperty("location")
    private LocationDTO locationDTO;

    private ProfileImageDetailsDTO profilePhoto;

    private String certificate;

    private String publicBio;

    private String experience;

    private List<String> roles;

    private List<String> equipment;

    private List<String> resources;

    private List<String> images;

    private List<String> videos;

}
