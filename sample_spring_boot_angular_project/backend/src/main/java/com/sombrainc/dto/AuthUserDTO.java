package com.sombrainc.dto;

import com.sombrainc.entity.enumeration.Role;
import com.sombrainc.entity.enumeration.UserStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthUserDTO {

    private String id;
    private String firstName;
    private String lastName;
    private String email;
    private Role role;
    private UserStatus status;
    private String logo;
    private String address;
    private boolean social;

}
