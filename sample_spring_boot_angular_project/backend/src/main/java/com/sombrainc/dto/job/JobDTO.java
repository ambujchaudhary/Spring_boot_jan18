package com.sombrainc.dto.job;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sombrainc.dto.LocationDTO;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.util.validator.RequiredField;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {

    private JobOwner ownerType;

    private String title;

    private LocalDate date;

    @RequiredField
    @JsonProperty("location")
    private LocationDTO locationDTO;

    private List<String> workerRoles;

    private String brief;

    private List<String> equipment;

    private String pricePerHour;

    private String numberOfHour;

    private List<String> attachment;

}
