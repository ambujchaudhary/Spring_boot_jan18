package com.sombrainc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class NotificationDTO {

    private String id;

    private String title;

    private String message;

    private String eventDate;

    private String receiver;

    private boolean hidden;

}
