package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserRegistrationDTO {

    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private String confirmPassword;

    @Override
    public String toString() {
        return "UserRegistrationDTO{" + "firstName='" + firstName + '\'' + ", lastName='" + lastName + '\'' + ", email='" + email + '\''
            + '}';
    }
}
