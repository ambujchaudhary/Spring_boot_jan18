package com.sombrainc.repository;

import com.sombrainc.entity.Feedback;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.JobStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeedbackRepository extends JpaRepository<Feedback, Long> {

    List<Feedback> findAllByReceiver_UserProfile_Id(Long profileId, Pageable pageable);

    List<Feedback> findAllByReceiver_UserProfile_Id(Long profileId);

    @Query("select fj from Feedback f right join f.job fj where fj.shooter  = :user and fj.jobStatus in :statuses "
        + "and (not exists (select f.id from f where f.author = :user and f.job = fj.id))")
    List<Job> findJobsForBusinessFeedback(@Param("user") User user, @Param("statuses") List<JobStatus> statuses);

    @Query("select fj from Feedback f right join f.job fj where fj.owner  = :user and fj.jobStatus in :statuses "
        + "and (not exists (select f.id from f where f.author = :user and f.job = fj.id))")
    List<Job> findJobsForShooterFeedback(@Param("user") User user, @Param("statuses") List<JobStatus> statuses);

    Optional<Feedback> findByJobAndAuthor(Job job, User author);

}
