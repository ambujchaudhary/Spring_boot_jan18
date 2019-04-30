package com.sombrainc.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "go_cardless_webhooks")
public class GoCardlessWebhooks {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "date")
    @CreatedDate
    private LocalDateTime date;

    @Column(name = "event_id")
    private String eventId;

    @Column(name = "action")
    private String action;

    @Column(name = "resource_type")
    private String resourceType;

    @Column(name = "resource_id")
    private String resourceId;

    private GoCardlessWebhooks(String eventId, String action, String resourceType, String resourceId) {
        this.eventId = eventId;
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
    }

    public static GoCardlessWebhooks createGoCardlessWebhook(String eventId, String action, String resourceType, String resourceId) {
        return new GoCardlessWebhooks(eventId, action, resourceType, resourceId);
    }
}
