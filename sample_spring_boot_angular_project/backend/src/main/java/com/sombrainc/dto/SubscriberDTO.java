package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SubscriberDTO {

    private String firstName;

    private String lastName;

    private String email;

    private String country;

}
