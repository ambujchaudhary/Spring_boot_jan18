package com.sombrainc.security.jwt;

import lombok.Data;

@Data
public class JWTTokenDTO {

    private String token;

    private JWTTokenDTO(String token) {
        this.token = token;
    }

    public static JWTTokenDTO of(String token) {
        return new JWTTokenDTO("Bearer " + token);
    }
}
