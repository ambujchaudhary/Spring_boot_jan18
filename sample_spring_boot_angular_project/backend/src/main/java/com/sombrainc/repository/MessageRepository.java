package com.sombrainc.repository;

import com.sombrainc.dto.job.ChatJobDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.Message;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.MessageStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {

    @Query(
        value = "SELECT new com.sombrainc.dto.job.ChatJobDTO(j) FROM Message m LEFT JOIN m.job j WHERE m.sender = :user OR m.recipient = :user GROUP BY m.job")
    List<ChatJobDTO> getAllChatJobs(@Param("user") User user);

    @Query(value = "SELECT m.recipient FROM Message m LEFT JOIN m.job j WHERE m.sender = :user AND m.job = :job")
    Set<User> getSenderChatMembers(@Param("user") User user, @Param("job") Job job);

    @Query(value = "SELECT m.sender FROM Message m LEFT JOIN m.job j WHERE m.recipient = :user AND m.job = :job")
    Set<User> getRecipientChatMembers(@Param("user") User user, @Param("job") Job job);

    @Query(
        value = "SELECT m FROM Message m WHERE ((m.sender = :currentUser AND m.recipient = :targetUser) OR (m.sender = :targetUser AND m.recipient = :currentUser)) AND m.job = :job")
    List<Message> getAllMessages(@Param("currentUser") User currentUser, @Param("targetUser") User targetUser, @Param("job") Job job);

    @Transactional
    @Modifying
    @Query("UPDATE Message m SET m.status = :status WHERE m.id = :id AND m.recipient = :user")
    void markAsRead(@Param("status") MessageStatus status, @Param("id") Long id, @Param("user") User user);

    @Transactional
    @Modifying
    @Query("UPDATE Message m SET m.status = :status WHERE m.id in :ids AND m.recipient = :user")
    void markAsReadList(@Param("status") MessageStatus status, @Param("ids") List<Long> ids, @Param("user") User user);

    List<Message> findByRecipient_EmailAndStatusIsOrderByCreatedAtDesc(String email, MessageStatus status);

    @Query("SELECT m FROM Message m WHERE m.id in :ids")
    List<Message> findByIds(@Param("ids") List<Long> ids);
}
