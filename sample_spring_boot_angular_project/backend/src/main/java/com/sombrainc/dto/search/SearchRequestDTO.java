package com.sombrainc.dto.search;

import com.sombrainc.entity.enumeration.JobTabType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SearchRequestDTO {

    private JobTabType tab;

    private String radius;

    private String lat;

    private String lng;

    private List<String> jobType;

    private String hourFrom;

    private String hourTo;

    private String amountFrom;

    private String amountTo;

    private String dateFrom;

    private String dateTo;
}
