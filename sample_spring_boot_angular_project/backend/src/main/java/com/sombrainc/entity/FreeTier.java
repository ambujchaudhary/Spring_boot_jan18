package com.sombrainc.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "free_tier")
public class FreeTier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "applications")
    private int applications;

    @Column(name = "jobs")
    private int jobs;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user")
    private User user;

    private FreeTier(int applications, int jobs, User user) {
        this.applications = applications;
        this.jobs = jobs;
        this.user = user;
    }

    public static FreeTier createNew(User user) {
        return new FreeTier(3, 1, user);
    }

    public static FreeTier createEmpty(User user) {
        return new FreeTier(0, 0, user);
    }

}
