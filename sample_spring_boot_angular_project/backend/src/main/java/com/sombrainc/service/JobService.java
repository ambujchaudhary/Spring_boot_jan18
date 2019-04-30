package com.sombrainc.service;

import com.sombrainc.dto.CreatedIdDTO;
import com.sombrainc.dto.JobStatisticDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.feedback.FeedbackDTO;
import com.sombrainc.dto.job.*;
import com.sombrainc.dto.search.SearchRequestDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.enumeration.JobStatus;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Map;

public interface JobService {

    CreatedIdDTO saveJob(JobDTO jobDTO);

    JobViewDTO getJob(Long id);

    RestMessageDTO editJob(Long jobId, JobDTO jobDTO);

    RestMessageDTO editJobByAdmin(Long jobId, JobDTO jobDTO);

    List<JobShortInfoDTO> getOwnJobs();

    RestMessageDTO applyForJob(Long id);

    RestMessageDTO cancelApplication(Long id);

    List<JobShortInfoDTO> getJobsByType(SearchRequestDTO searchRequestDTO, Pageable pageable);

    RestMessageDTO changeApplicantMark(Long jobId, Long applicantId);

    void changeJobStatus(Job job, JobStatus jobStatus);

    Map<String, String> getTitleByJobId(Long id);

    JobModalWithTitleDTO getJobModalWithTitle(Long id);

    JobModalWithShooterNameDTO getJobModalWithShooterName(Long id);

    RestMessageDTO cancelJob(Long id);

    RestMessageDTO renewJob(Long id);

    CompletedJobsInfoDTO getCompletedJobs();

    RestMessageDTO markAsDone(Long id);

    JobStatisticDTO getJobsStatistic();

    List<JobBasicInfoDTO> getPreExpireJobList();

    RestMessageDTO completeJobAndCreateFeedback(Long jobId, FeedbackDTO feedbackDTO);

    JobShortInfoDTO hideOwnerName(JobShortInfoDTO jobShortInfoDTO);
}
