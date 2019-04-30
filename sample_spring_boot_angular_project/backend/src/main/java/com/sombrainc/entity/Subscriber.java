package com.sombrainc.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "subscriber")
public class Subscriber {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Size(min = 1, max = 40, message = "Subscriber first name can't be longer than 40 characters")
    @Column(name = "first_name")
    private String firstName;

    @NotNull
    @Size(min = 1, max = 40, message = "Subscriber last name longer than 40 characters")
    @Column(name = "last_name")
    private String lastName;

    @NotNull
    @Email
    @Column(name = "email")
    private String email;

    @NotNull
    @Size(min = 2, max = 2)
    @Column(name = "country")
    private String country;

    @Column(name = "date")
    @CreatedDate
    private LocalDateTime date;

}
