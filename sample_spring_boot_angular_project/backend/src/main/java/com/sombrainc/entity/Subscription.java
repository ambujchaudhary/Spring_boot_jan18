package com.sombrainc.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sombrainc.entity.enumeration.SubscriptionStatus;
import com.sombrainc.entity.enumeration.SubscriptionType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "subscription")
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 1, max = 255, message = "Subscription id can't be longer than 255 characters")
    @Column(name = "subscription_id")
    private String subscriptionId;

    @Column(name = "date_from")
    private LocalDateTime dateFrom;

    @Column(name = "date_to")
    private LocalDateTime dateTo;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_status")
    private SubscriptionStatus status;

    @Enumerated(EnumType.STRING)
    @Column(name = "subscription_type")
    private SubscriptionType type;

    @Column(name = "subscription_failed")
    private LocalDateTime subscriptionFailed;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users")
    private User users;

    @Override
    public String toString() {
        return "Subscription{" + "id=" + id + ", subscriptionId='" + subscriptionId + '\'' + ", dateFrom=" + dateFrom + ", dateTo=" + dateTo
            + ", status=" + status + ", type=" + type + ", subscriptionFailed=" + subscriptionFailed + '}';
    }
}
