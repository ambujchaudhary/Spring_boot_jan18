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
public class JobModalForFeedbackDTO {

    private String id;

    private LocalDate date;

    private String amount;

    private String fullName;

    private String title;

}
