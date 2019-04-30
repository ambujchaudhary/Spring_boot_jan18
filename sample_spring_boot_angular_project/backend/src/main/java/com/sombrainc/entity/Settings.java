package com.sombrainc.entity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "settings")
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "radius")
    private int radius;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "users")
    private User users;

    @Column(name = "email")
    private boolean email;

    @Column(name = "push")
    private boolean push;

}
