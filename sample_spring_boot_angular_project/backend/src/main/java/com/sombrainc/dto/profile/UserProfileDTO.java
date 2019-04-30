package com.sombrainc.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sombrainc.dto.LocationDTO;
import com.sombrainc.entity.enumeration.Experience;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.validator.RequiredField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDTO {

    @RequiredField
    @JsonProperty("location")
    private LocationDTO locationDTO;

    @RequiredField
    private String profilePhoto;

    private String certificate;

    @RequiredField
    private String publicBio;

    @RequiredField
    private Experience experience;

    private List<String> equipment;

    private List<String> resources;

    private List<String> images;

    private List<String> videos;

    @RequiredField
    private List<WorkerRole> roles;
}
