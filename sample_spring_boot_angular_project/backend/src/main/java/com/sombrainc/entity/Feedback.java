package com.sombrainc.entity;

import com.sombrainc.entity.enumeration.FeedbackType;
import com.sombrainc.entity.enumeration.Star;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@Table(name = "feedback")
public class Feedback extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Enumerated(EnumType.STRING)
    @Column(name = "star")
    private Star star;

    @NotNull
    @Column(name = "review")
    private String review;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "job")
    private Job job;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author")
    private User author;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "receiver")
    private User receiver;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "feedback_type")
    private FeedbackType feedbackType;

    private Feedback(Star star, String review, Job job, User author, User receiver, FeedbackType feedbackType) {
        this.star = star;
        this.review = review;
        this.job = job;
        this.author = author;
        this.receiver = receiver;
        this.feedbackType = feedbackType;
    }

    public static Feedback createFeedback(Star star, String review, Job job, User author, User receiver, FeedbackType feedbackType) {
        return new Feedback(star, review, job, author, receiver, feedbackType);
    }

}
