package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestMessageDTO {

    private String message;
    private boolean success;

    public static RestMessageDTO createFailureRestMessageDTO(String message) {
        return new RestMessageDTO(message, false);
    }

    public static RestMessageDTO createSuccessRestMessageDTO(String message) {
        return new RestMessageDTO(message, true);
    }

}
