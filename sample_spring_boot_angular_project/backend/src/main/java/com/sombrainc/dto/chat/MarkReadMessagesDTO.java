package com.sombrainc.dto.chat;

import lombok.Data;

import java.util.List;

@Data
public class MarkReadMessagesDTO {

    private List<Long> ids;
}
