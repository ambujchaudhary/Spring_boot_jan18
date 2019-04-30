package com.sombrainc.entity;

import com.sombrainc.entity.enumeration.NotificationType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "event_date")
    @CreatedDate
    private LocalDateTime eventDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver")
    private User receiver;

    @Column(name = "title")
    private String title;

    @Column(name = "message")
    private String message;

    @Column(name = "hidden")
    private boolean hidden;

    @Column(name = "deleted")
    private boolean deleted;

    @Enumerated(EnumType.STRING)
    @Column(name = "notification_type")
    private NotificationType notificationType;

    @Column(name = "link")
    private String link;

    public static Notification.NotificationBuilder createDefault(NotificationType notificationType, User receiver) {
        return Notification
            .builder()
            .receiver(receiver)
            .title(notificationType.getTitle())
            .eventDate(LocalDateTime.now(ZoneId.systemDefault()))
            .message(notificationType.getBody())
            .notificationType(notificationType)
            .link(notificationType.getUrl());
    }
}
