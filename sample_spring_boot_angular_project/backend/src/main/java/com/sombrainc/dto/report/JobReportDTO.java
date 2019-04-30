package com.sombrainc.dto.report;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class JobReportDTO {

    private String postedBy;

    private String jobTitle;

    private String dollarValue;

    private String createdDate;

    private String jobDate;

    private String status;

    private String numberOfApplicants;

    private String dateClosed;

    private String shooter;

    private BigDecimal latitude;

    private BigDecimal longitude;
}
