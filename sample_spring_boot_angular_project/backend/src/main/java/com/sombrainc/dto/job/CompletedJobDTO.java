package com.sombrainc.dto.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CompletedJobDTO {

    private Long id;

    private String title;

    private String ownerFullName;

    private Long ownerId;

    private String shooterFullName;

    private Long shooterId;

    private String amount;

    private LocalDate date;
}
