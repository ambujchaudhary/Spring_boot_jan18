package com.sombrainc.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BusinessProfileDTO {

    private String businessName;

    private String ABN;

    private boolean GST;

    @JsonProperty("location")
    private LocationDTO locationDTO;

    private String webAddress;
}
