package com.sombrainc.repository;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.JobApplicant;
import com.sombrainc.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobApplicantRepository extends JpaRepository<JobApplicant, Long> {

    List<JobApplicant> findAllByJob(Job job);

    Optional<JobApplicant> findByJobAndApplicant(Job job, User user);

    @Query("select count(ja) from JobApplicant ja where year(ja.date) = :year and month(ja.date) = :month and day(ja.date) = :day ")
    int countJobAppsByDay(@Param("year") int year, @Param("month") int month, @Param("day") int day);

    @Query("select count(ja) from JobApplicant ja where year(ja.date) = :year and month(ja.date) = :month ")
    int countJobAppsByMonth(@Param("year") int year, @Param("month") int month);

    @Query("select count(ja) from JobApplicant ja where year(ja.date) = :year ")
    int countJobAppsByYear(@Param("year") int year);

}
