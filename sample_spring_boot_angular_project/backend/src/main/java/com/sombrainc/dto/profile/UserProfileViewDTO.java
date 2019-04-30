package com.sombrainc.dto.profile;

import com.sombrainc.dto.ImageDetailsDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileViewDTO {

    private String address;

    private String firstName;

    private String lastName;

    private String businessName;

    private String profilePhoto;

    private String certificate;

    private String publicBio;

    private String experience;

    private List<String> roles;

    private List<String> equipment;

    private List<String> resources;

    private List<ImageDetailsDTO> images;

    private List<String> videos;

    private BigDecimal averageFeedback;

    private int feedbackQuantity;

    private boolean currentUser;

    private String adminsComment;

}
