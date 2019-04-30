package com.sombrainc.service.impl;

import com.sombrainc.dto.chat.ChatMemberDTO;
import com.sombrainc.dto.chat.MessageDTO;
import com.sombrainc.dto.chat.NewMessageDTO;
import com.sombrainc.dto.job.ChatJobDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.Message;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.MessageStatus;
import com.sombrainc.repository.JobRepository;
import com.sombrainc.repository.MessageRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.ChatService;
import com.sombrainc.service.EmailService;
import com.sombrainc.service.FirebaseService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.MessageDTOMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ChatServiceImpl implements ChatService {

    private static final String MESSAGES_LINK = "/messages";

    private static final String NEW_MESSAGE_TITLE = "You have a new message";

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private FirebaseService firebaseService;

    @Autowired
    private EmailService emailService;

    @Override
    public void handleNewMessage(NewMessageDTO newMessageDTO) {
        Job job = jobRepository.getOne(Long.valueOf(newMessageDTO.getJobId()));
        User sender = userRepository.getOne(Long.valueOf(newMessageDTO.getSender()));
        User recipient = userRepository.getOne(Long.valueOf(newMessageDTO.getRecipient()));
        Message newMessage = Message
            .builder()
            .status(MessageStatus.UNREAD)
            .text(newMessageDTO.getText())
            .sender(sender)
            .recipient(recipient)
            .job(job)
            .build();
        messageRepository.save(newMessage);
        MessageDTO forRecipient = convertTimeZone(MessageDTOMapper.INSTANCE.map(newMessage), newMessage.getRecipient());
        MessageDTO forSender = convertTimeZone(MessageDTOMapper.INSTANCE.map(newMessage), newMessage.getSender());
        sendMessage(newMessage.getRecipient().getEmail(), forRecipient);
        sendMessage(newMessage.getSender().getEmail(), forSender);
        firebaseService.sendNotification(NEW_MESSAGE_TITLE, newMessage.getText(), newMessage.getRecipient().getId(), MESSAGES_LINK,
            job.getId(), sender.getId());
        emailService.sendNewMessageEmail(recipient.getEmail());
    }

    @Override
    public List<ChatJobDTO> getChatJobs() {
        User user = userService.getCurrentUser();
        LOGGER.info("get all jobs with chat for user: " + user.getEmail());
        return messageRepository.getAllChatJobs(user);
    }

    @Override
    public List<ChatMemberDTO> getChatMembersByJobId(Long jobId) {
        LOGGER.info("get chat members by job id: " + jobId);
        User user = userService.getCurrentUser();
        Job job = jobRepository.getOne(jobId);
        Set<User> recipients = messageRepository.getSenderChatMembers(user, job);
        Set<User> senders = messageRepository.getRecipientChatMembers(user, job);
        recipients.addAll(senders);
        return recipients.stream().map(ChatMemberDTO::of).collect(Collectors.toList());
    }

    @Override
    public List<MessageDTO> getAllMessages(Long jobId, Long recipientId) {
        LOGGER.info("get all messages for job id: " + jobId + " by recipient: " + recipientId);
        User currentUser = userService.getCurrentUser();
        User targetUser = userRepository.getOne(recipientId);
        Job job = jobRepository.getOne(jobId);
        return messageRepository
            .getAllMessages(currentUser, targetUser, job)
            .stream()
            .map(MessageDTOMapper.INSTANCE::map)
            .map(m -> convertTimeZone(m, currentUser))
            .collect(Collectors.toList());
    }

    @Override
    public void markAsReadList(List<Long> ids) {
        LOGGER.info("mark as read messages with ids: " + Arrays.toString(ids.toArray()));
        User user = userService.getCurrentUser();
        messageRepository.markAsReadList(MessageStatus.READ, ids, user);
        messageRepository.findByIds(ids).forEach(this::sendViaSocketToBothUsers);
    }

    private void sendViaSocketToBothUsers(Message message) {
        LOGGER.info("Message marked as read: " + message.getId());
        MessageDTO forRecipient = convertTimeZone(MessageDTOMapper.INSTANCE.map(message), message.getRecipient());
        MessageDTO forSender = convertTimeZone(MessageDTOMapper.INSTANCE.map(message), message.getSender());
        sendMessage(message.getRecipient().getEmail(), forRecipient);
        sendMessage(message.getSender().getEmail(), forSender);
    }

    @Override
    public void sendAllUnreadMessages() {
        User user = userService.getCurrentUser();
        String email = user.getEmail();
        LOGGER.info("Send all unread messages for " + email);
        messageRepository
            .findByRecipient_EmailAndStatusIsOrderByCreatedAtDesc(email, MessageStatus.UNREAD)
            .stream()
            .map(MessageDTOMapper.INSTANCE::map)
            .map(m -> convertTimeZone(m, user))
            .forEach(messageDTO -> sendMessage(email, messageDTO));
    }

    private void sendMessage(String email, MessageDTO messageDTO) {
        LOGGER.info("Message to " + email + " from: " + messageDTO.getSender());
        template.convertAndSendToUser(email, "/queue/message", messageDTO);
    }

    private MessageDTO convertTimeZone(MessageDTO messageDTO, User user) {
        String zoneId = user.getUserProfile().getTimezone();
        ZoneId userTimeZone = ZoneId.of(zoneId);
        LocalDateTime convertedDateTime = messageDTO
            .getSentDate()
            .atZone(ZoneId.systemDefault())
            .withZoneSameInstant(userTimeZone)
            .toLocalDateTime();
        messageDTO.setSentDate(convertedDateTime);
        return messageDTO;
    }
}
