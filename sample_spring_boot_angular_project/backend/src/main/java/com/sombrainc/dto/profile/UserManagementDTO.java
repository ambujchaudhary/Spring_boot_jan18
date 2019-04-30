package com.sombrainc.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.sombrainc.dto.UsersDetailsForAdminDTO;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class UserManagementDTO {

    private int approvedCounter;

    private int pendingCounter;

    private int blockedCounter;

    private int newCounter;

    @JsonProperty("approved")
    private List<UsersDetailsForAdminDTO> approvedList;

    @JsonProperty("pending")
    private List<UsersDetailsForAdminDTO> pendingList;

    @JsonProperty("blocked")
    private List<UsersDetailsForAdminDTO> blockedList;

    @JsonProperty("new")
    private List<UsersDetailsForAdminDTO> newList;

}
