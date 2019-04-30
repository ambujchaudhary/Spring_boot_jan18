package com.sombrainc.dto;

import lombok.Data;

@Data
public class GoCardlessCompleteRedirectFlowDTO {

    private String redirectFlowId;
    private Boolean isCompleted;

}
