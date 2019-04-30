package com.sombrainc.dto.chat;

import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class NewMessageDTO {

    @NotNull
    private String text;

    @NotNull
    private String jobId;

    @NotNull
    private String sender;

    @NotNull
    private String recipient;
}
