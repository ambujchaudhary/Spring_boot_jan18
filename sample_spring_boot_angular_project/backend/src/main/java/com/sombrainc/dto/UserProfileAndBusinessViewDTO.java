package com.sombrainc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
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
public class UserProfileAndBusinessViewDTO {

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

    private String ABN;

    private boolean GST;

    private String businessAddress;

    private String webAddress;

    private String status;

    private boolean blocked;

}
