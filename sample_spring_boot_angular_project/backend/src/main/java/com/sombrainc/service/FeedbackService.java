package com.sombrainc.service;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.feedback.FeedbackDTO;
import com.sombrainc.dto.feedback.FeedbackDataDTO;
import com.sombrainc.dto.feedback.FeedbackTextDTO;
import com.sombrainc.dto.job.JobModalForFeedbackDTO;
import com.sombrainc.entity.Job;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FeedbackService {

    List<FeedbackTextDTO> getFeedbackList(Long profileId, Pageable pageable);

    FeedbackDataDTO getFeedbackData(Long profileId);

    RestMessageDTO createFeedbackForBusiness(FeedbackDTO feedbackDTO, Long jobId);

    void createFeedbackForShooter(FeedbackDTO feedbackDTO, Job job);

    List<JobModalForFeedbackDTO> getJobsForBusinessFeedback();

    RestMessageDTO createFeedbackForShooterAfterAutoComplete(FeedbackDTO feedbackDTO, Long jobId);

    List<JobModalForFeedbackDTO> getJobsForShooterFeedback();
}
