package com.sombrainc.dto;

import lombok.Data;

@Data
public class ChangePasswordDTO {

    private String oldPassword;

    private String newPassword;

    private String confirmPassword;
}
