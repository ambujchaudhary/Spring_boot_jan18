package com.sombrainc.dto;

import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.entity.enumeration.WorkerRole;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersDetailsForAdminDTO {

    private Long id;

    private String fullName;

    private String address;

    private LocalDate joined;

    private List<WorkerRole> roles;

    private UserStatus status;

}
