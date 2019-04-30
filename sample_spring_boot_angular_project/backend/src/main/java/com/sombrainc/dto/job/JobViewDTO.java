package com.sombrainc.dto.job;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sombrainc.dto.FileDetailsDTO;
import com.sombrainc.dto.LocationDTO;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.util.validator.RequiredField;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobViewDTO {

    private JobOwner ownerType;

    private String ownerName;

    private String title;

    private LocalDate date;

    private LocalDate lastAction;

    @RequiredField
    @JsonProperty("location")
    private LocationDTO locationDTO;

    private List<String> workerRoles;

    private String brief;

    private List<String> equipment;

    private String pricePerHour;

    private String numberOfHour;

    private List<FileDetailsDTO> attachment;

    private String status;

    private String ownershipType;

    private List<ApplicantDTO> applicants;

    private String ownerId;

    private String ownerProfileId;

}
