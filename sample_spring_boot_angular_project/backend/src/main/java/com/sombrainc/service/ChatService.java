package com.sombrainc.service;

import com.sombrainc.dto.chat.ChatMemberDTO;
import com.sombrainc.dto.chat.MessageDTO;
import com.sombrainc.dto.chat.NewMessageDTO;
import com.sombrainc.dto.job.ChatJobDTO;

import java.util.List;

public interface ChatService {

    void handleNewMessage(NewMessageDTO newMessageDTO);

    List<ChatJobDTO> getChatJobs();

    List<ChatMemberDTO> getChatMembersByJobId(Long jobId);

    List<MessageDTO> getAllMessages(Long jobId, Long recipientId);

    void markAsReadList(List<Long> ids);

    void sendAllUnreadMessages();
}
