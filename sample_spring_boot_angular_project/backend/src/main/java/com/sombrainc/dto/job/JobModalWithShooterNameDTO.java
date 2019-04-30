package com.sombrainc.dto.job;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JobModalWithShooterNameDTO {

    private String shooterName;

    private LocalDate date;

    private String amount;

}
