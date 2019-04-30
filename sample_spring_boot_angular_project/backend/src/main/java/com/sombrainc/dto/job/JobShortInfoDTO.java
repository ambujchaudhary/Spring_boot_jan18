package com.sombrainc.dto.job;

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
public class JobShortInfoDTO {

    private String id;

    private String ownerType;

    private String title;

    private LocalDate date;

    private LocalDate lastAction;

    private String address;

    private List<String> workerRoles;

    private String brief;

    private String pricePerHour;

    private String numberOfHour;

    private String applicants;

    private String status;

    private String ownershipType;

    private String ownerId;

    private String shooterId;

    private String shooterFullName;

}
