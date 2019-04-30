package com.sombrainc.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class JobStatisticDTO {

    private int myApplications;

    private int activeJobs;

    private int pendingJobs;

    private int totalApplicants;
}
