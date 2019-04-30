package com.sombrainc.dto.job;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CompletedJobsInfoDTO {

    private int pendingCounter;

    private int closedCounter;

    private int allCounter;

    @JsonProperty("pending")
    private List<CompletedJobDTO> completedJobDTOList;

    @JsonProperty("closed")
    private List<CompletedJobDTO> doneJobDTOList;

    @JsonProperty("all")
    private List<CompletedJobDTO> allJobDTOList;

}
