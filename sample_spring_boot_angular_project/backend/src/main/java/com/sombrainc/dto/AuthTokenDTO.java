package com.sombrainc.dto;

import lombok.Getter;

public class AuthTokenDTO {

    @Getter
    private String token;

    @Getter
    private String email;
}
