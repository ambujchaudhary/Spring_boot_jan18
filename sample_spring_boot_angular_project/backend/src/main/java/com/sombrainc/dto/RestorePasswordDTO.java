package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class RestorePasswordDTO {

    private String password;
    private String confirmPassword;
    private String token;

}
