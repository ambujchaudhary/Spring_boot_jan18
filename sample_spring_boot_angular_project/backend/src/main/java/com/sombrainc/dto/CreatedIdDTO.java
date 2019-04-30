package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreatedIdDTO {

    private String id;

    public static CreatedIdDTO of(Long createdId) {
        return new CreatedIdDTO(createdId.toString());
    }

}
