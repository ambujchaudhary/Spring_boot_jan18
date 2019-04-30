package com.sombrainc.controller;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.feedback.FeedbackDTO;
import com.sombrainc.dto.feedback.FeedbackTextDTO;
import com.sombrainc.dto.job.JobModalForFeedbackDTO;
import com.sombrainc.service.FeedbackService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class FeedbackController {

    @Autowired
    private FeedbackService feedbackService;

    @GetMapping("/api/protected/profiles/{id}/feedback")
    public List<FeedbackTextDTO> getFeedback(@PathVariable(value = "id") final Long profileId,
        @PageableDefault(size = 3) Pageable pageable) {
        return feedbackService.getFeedbackList(profileId, pageable);
    }

    @PostMapping("/api/protected/jobs/{id}/feedback/business")
    public RestMessageDTO createFeedbackForBusiness(@PathVariable(value = "id") final Long jobId, @RequestBody FeedbackDTO feedbackDTO) {
        return feedbackService.createFeedbackForBusiness(feedbackDTO, jobId);
    }

    @GetMapping("/api/protected/feedback/business")
    public List<JobModalForFeedbackDTO> getJobsForBusinessFeedback() {
        return feedbackService.getJobsForBusinessFeedback();
    }


    @PostMapping("/api/protected/jobs/{id}/feedback/shooter")
    public RestMessageDTO createFeedbackForShooter(@PathVariable(value = "id") final Long jobId, @RequestBody FeedbackDTO feedbackDTO) {
        return feedbackService.createFeedbackForShooterAfterAutoComplete(feedbackDTO, jobId);
    }

    @GetMapping("/api/protected/feedback/shooter")
    public List<JobModalForFeedbackDTO> getJobsForShooterFeedback() {
        return feedbackService.getJobsForShooterFeedback();
    }

}
