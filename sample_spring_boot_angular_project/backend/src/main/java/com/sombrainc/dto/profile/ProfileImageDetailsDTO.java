package com.sombrainc.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileImageDetailsDTO {

    private String url;

    private String originalName;

    private String fullName;

    private String size200;

    private String logo;

}
