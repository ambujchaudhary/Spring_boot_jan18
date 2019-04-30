package com.sombrainc.entity;

import com.sombrainc.entity.enumeration.MessageStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import java.util.Objects;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Message extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job")
    private Job job;

    @Column(name = "message")
    private String text;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender")
    private User sender;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient")
    private User recipient;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_status")
    private MessageStatus status;

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (o == null || getClass() != o.getClass()) {
            return false;
        }
        if (!super.equals(o)) {
            return false;
        }

        Message message = (Message) o;

        return getId() != null ? getId().equals(message.getId()) : message.getId() == null;
    }

    @Override
    public int hashCode() {
        return Objects.hashCode(getId());
    }
}
