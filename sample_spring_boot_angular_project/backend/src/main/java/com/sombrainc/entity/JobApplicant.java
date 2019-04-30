package com.sombrainc.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "job_applicant")
public class JobApplicant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job")
    private Job job;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant")
    private User applicant;

    @Column(name = "date")
    @CreatedDate
    private LocalDateTime date;

    @Column(name = "marked")
    private boolean marked;

    private JobApplicant(Job job, User applicant) {
        this.job = job;
        this.applicant = applicant;
    }

    public static JobApplicant createJobApplicant(Job job, User applicant) {
        return new JobApplicant(job, applicant);
    }

    @Override
    public String toString() {
        return "JobApplicant{" + "id=" + id + '}';
    }
}
