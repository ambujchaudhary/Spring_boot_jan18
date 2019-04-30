package com.sombrainc.dto.job;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicantDTO {

    private Long id;

    private Long profileId;

    private String firstName;

    private String lastName;

    private LocalDate date;

    private boolean marked;

    private boolean hired;

    public ApplicantDTO setDate(LocalDateTime date) {
        this.date = date.toLocalDate();
        return this;
    }
}
