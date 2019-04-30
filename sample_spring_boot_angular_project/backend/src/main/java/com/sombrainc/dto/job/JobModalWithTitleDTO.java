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
public class JobModalWithTitleDTO {

    private String title;

    private LocalDate date;

    private String amount;
}
