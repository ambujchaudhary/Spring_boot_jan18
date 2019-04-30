package com.sombrainc.repository;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.JobStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {

    List<Job> findJobsByOwnerEqualsOrderByDateAsc(User user);

    @Query("SELECT COUNT(j) FROM Job j WHERE j.owner = :user AND j.jobStatus IN :statuses")
    int countPendingJobs(@Param("user") User user, @Param("statuses") List<JobStatus> statuses);

    @Query(value = "select distinct j from Job j left join j.jobApplicants ja left join j.offers jo "
        + "where j.jobStatus in :statuses and j.owner <> :user and ja.applicant = :user "
        + "and (jo is null or (jo.shooter <> :user and (jo.accepted = null or jo.accepted = false)) or (jo.shooter = :user and jo.accepted = null))"
        + "and ((select jo.shooter from jo where jo.shooter = :user and jo.accepted = false and job = j.id) is null)")
    List<Job> findByStatusNotOwnerAndApplicant(@Param("statuses") List<JobStatus> statuses, @Param("user") User user, Pageable pageable);

    @Query("select count(distinct j) from Job j left join j.jobApplicants ja left join j.offers jo "
        + "where j.jobStatus in :statuses and j.owner <> :user and ja.applicant = :user and ((jo.accepted is null) or (jo.accepted = true))")
    int countMyApplications(@Param("statuses") List<JobStatus> statuses, @Param("user") User user);

    @Query(
        value = "select distinct j from Job j left join j.offers jo where j.jobStatus in :statuses and j.owner <> :user and j.shooter = :user and ((jo.accepted is null) or (jo.accepted = true))")
    List<Job> findByJobStatusInAndShooterIsAndOwnerIsNot(@Param("statuses") List<JobStatus> statuses, @Param("user") User user,
        Pageable pageable);

    @Query("select count(distinct j) from Job j left join j.jobApplicants ja left join j.offers jo "
        + "where j.jobStatus in :statuses and j.owner <> :user and j.shooter = :user and ((jo.accepted is null) or (jo.accepted = true))")
    int countActiveJobs(@Param("statuses") List<JobStatus> statuses, @Param("user") User user);

    @Query(value = "select distinct j from Job j left join j.jobApplicants ja left join j.offers jo "
        + "where (j.owner <> :user) and ((j.jobStatus not in :waitingStatuses and j.shooter <> :user and ja.applicant = :user) "
        + "or (j.jobStatus in :archivedStatuses and j.shooter = :user) or (ja.applicant = :user and jo.accepted = false and jo.shooter = :user))")
    List<Job> findArchivedJobs(@Param("waitingStatuses") List<JobStatus> waitStatuses, @Param("user") User user,
        @Param("archivedStatuses") List<JobStatus> archStatuses, Pageable pageable);

    @Query("select j.title from Job j where j.id = :id")
    String findTitleById(@Param("id") Long id);

    List<Job> findByJobStatusEqualsAndDate(JobStatus jobStatus, LocalDate localDate);

    List<Job> findByJobStatusEqualsAndDateLessThanEqual(JobStatus jobStatus, LocalDate localDate);

    List<Job> findByJobStatusEqualsAndLastAction(JobStatus jobStatus, LocalDate localDate);

    List<Job> findByJobStatusEqualsAndLastActionLessThanEqual(JobStatus jobStatus, LocalDate localDate);

    List<Job> findByOwnerAndJobStatusEqualsAndLastActionIn(User user, JobStatus jobStatus, List<LocalDate> localDates);

    List<Job> findByDateIs(LocalDate jobDate);

    List<Job> findByJobStatusIs(JobStatus jobStatus);

    List<Job> findByJobStatusIn(List<JobStatus> jobStatuses);

    List<Job> findByDateAndJobStatus(LocalDate jobDate, JobStatus jobStatus);

    @Transactional
    @Modifying
    @Query("UPDATE Job j SET j.jobStatus = :status WHERE j.id = :id")
    void markAsDone(@Param("id") Long id, @Param("status") JobStatus status);

    @Query("SELECT COUNT(ja) FROM Job j LEFT JOIN j.jobApplicants ja WHERE j.owner = :user AND (j.jobStatus = 'NEW' OR j.jobStatus = 'WAITING_FOR_RESPONSE')")
    int countTotalApplicants(@Param("user") User user);

    @Query("select count(distinct ja) from Job j left join j.jobApplicants ja left join j.offers jo "
        + "where j = :job and ja.applicant not in (select jo.shooter from jo where jo.job = :job and accepted = false)")
    int countJobApplicants(@Param("job") Job job);

    @Query("select count(j) from Job j where year(j.createdAt) = :year and month(j.createdAt) = :month and day(j.createdAt) = :day ")
    int countJobsByDay(@Param("year") int year, @Param("month") int month, @Param("day") int day);

    @Query("select count(j) from Job j where year(j.createdAt) = :year and month(j.createdAt) = :month ")
    int countJobsByMonth(@Param("year") int year, @Param("month") int month);

    @Query("select count(j) from Job j where year(j.createdAt) = :year ")
    int countJobsByYear(@Param("year") int year);

}
