package com.sombrainc.controller;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.chat.ChatMemberDTO;
import com.sombrainc.dto.chat.MarkReadMessagesDTO;
import com.sombrainc.dto.chat.MessageDTO;
import com.sombrainc.dto.chat.NewMessageDTO;
import com.sombrainc.dto.job.ChatJobDTO;
import com.sombrainc.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
public class ChatController {

    @Autowired
    private ChatService chatService;

    @PostMapping("/api/protected/messages")
    public void receiveMessage(@Valid @RequestBody NewMessageDTO newMessageDTO) {
        chatService.handleNewMessage(newMessageDTO);
    }

    @GetMapping("/api/protected/messages/jobs")
    public List<ChatJobDTO> getAllChatJobs() {
        return chatService.getChatJobs();
    }

    @GetMapping("/api/protected/messages/jobs/{jobId}")
    public List<ChatMemberDTO> getAllChatMembers(@PathVariable(value = "jobId") final Long jobId) {
        return chatService.getChatMembersByJobId(jobId);
    }

    @GetMapping("/api/protected/messages/jobs/{jobId}/recipient/{userId}")
    public List<MessageDTO> getAllMessages(@PathVariable(value = "jobId") final Long jobId,
        @PathVariable(value = "userId") final Long userId) {
        return chatService.getAllMessages(jobId, userId);
    }

    @PutMapping("/api/protected/messages/read")
    public ResponseEntity<Void> markAsReadAll(@RequestBody MarkReadMessagesDTO markReadMessagesDTO) {
        chatService.markAsReadList(markReadMessagesDTO.getIds());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/api/protected/messages")
    public RestMessageDTO sendAllUnread() {
        chatService.sendAllUnreadMessages();
        return RestMessageDTO.createSuccessRestMessageDTO("Messages sent");
    }
}
