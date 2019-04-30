package com.sombrainc.dto;

import com.sombrainc.dto.profile.ProfileImageDetailsDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserInfoDTO {

    private LocationDTO profileLocation;

    private String firstName;

    private String lastName;

    private String businessName;

    private ProfileImageDetailsDTO profilePhoto;

    private FileDetailsDTO certificate;

    private String publicBio;

    private String experience;

    private List<String> roles;

    private List<String> equipment;

    private List<String> resources;

    private List<ImageDetailsDTO> images;

    private List<String> videos;

    private String abn;

    private boolean gst;

    private LocationDTO businessLocation;

    private String webAddress;

}
