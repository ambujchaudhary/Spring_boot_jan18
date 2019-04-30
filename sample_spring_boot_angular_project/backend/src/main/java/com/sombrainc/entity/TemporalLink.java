package com.sombrainc.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.sombrainc.entity.enumeration.TemporalLinkType;
import com.sombrainc.util.RandomUtil;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Data
@Entity
@NoArgsConstructor
@Table(name = "temporal_links")
public class TemporalLink {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Size(min = 1, max = 30, message = "Temporal link token can't be longer than 30 characters")
    @Column(name = "token", length = 30, unique = true, nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private TemporalLinkType type;

    @Column(name = "active", nullable = false)
    private Boolean active = true;

    @Column(name = "expiry_date")
    private LocalDateTime expiryDate;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users")
    private User users;

    private TemporalLink(String token, TemporalLinkType type, LocalDateTime date, User users) {
        this.token = token;
        this.type = type;
        this.expiryDate = date;
        this.users = users;
    }

    public static TemporalLink createForgotPasswordLink(int expiryHours, User user) {
        return new TemporalLink(RandomUtil.generateToken(), TemporalLinkType.FORGOT_PASSWORD_CONFIRMATION,
            LocalDateTime.now().plusHours(expiryHours), user);
    }
}
