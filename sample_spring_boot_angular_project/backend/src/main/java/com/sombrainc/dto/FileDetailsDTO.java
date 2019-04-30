package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FileDetailsDTO {

    private String url;

    private String originalName;

    private String fullName;

    private String size200;
}
