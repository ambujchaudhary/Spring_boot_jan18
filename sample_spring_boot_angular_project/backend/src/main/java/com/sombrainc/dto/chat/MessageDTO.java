package com.sombrainc.dto.chat;

import com.sombrainc.dto.job.ChatJobDTO;
import com.sombrainc.entity.enumeration.MessageStatus;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MessageDTO {

    private String id;

    private ChatJobDTO chatJobDTO;

    private String text;

    private String chatId;

    private ChatMemberDTO sender;

    private ChatMemberDTO recipient;

    private MessageStatus status;

    private LocalDateTime sentDate;
}
