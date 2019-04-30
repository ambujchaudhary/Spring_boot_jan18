package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
public class FacebookCheckDTO {

    @Getter
    private boolean exist;

    public static FacebookCheckDTO exist() {
        return new FacebookCheckDTO(true);
    }

    public static FacebookCheckDTO notExist() {
        return new FacebookCheckDTO(false);
    }
}
