package com.sombrainc.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sombrainc.dto.FileDetailsDTO;
import com.sombrainc.dto.LocationDTO;
import com.sombrainc.util.validator.RequiredField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileWithCommentDTO {

    @RequiredField
    @JsonProperty("location")
    private LocationDTO locationDTO;

    private FileDetailsDTO profilePhoto;

    private FileDetailsDTO certificate;

    private String publicBio;

    private String adminsComment;

    private String experience;

    private List<String> equipment;

    private List<String> resources;

    private List<FileDetailsDTO> images;

    private List<String> videos;

    private List<String> roles;

}
