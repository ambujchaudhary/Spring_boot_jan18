package com.sombrainc.controller;

import com.sombrainc.dto.CreatedIdDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.feedback.FeedbackDTO;
import com.sombrainc.dto.job.*;
import com.sombrainc.dto.search.SearchRequestDTO;
import com.sombrainc.entity.enumeration.JobTabType;
import com.sombrainc.service.JobService;
import com.sombrainc.util.JobTabTypeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.MediaType;
import org.springframework.web.bind.WebDataBinder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
public class JobController {

    @Autowired
    private JobService jobService;

    @PostMapping("/api/protected/jobs")
    public CreatedIdDTO saveJob(@RequestBody JobDTO jobDTO) {
        return jobService.saveJob(jobDTO);
    }

    @GetMapping("/api/protected/jobs/{id}")
    public JobViewDTO getJob(@PathVariable(value = "id") final Long id) {
        return jobService.getJob(id);
    }

    @GetMapping(value = "/api/protected/jobs/{id}/title", produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, String> getJobTitle(@PathVariable(value = "id") final Long id) {
        return jobService.getTitleByJobId(id);
    }

    @GetMapping("/api/protected/jobs/{id}/modal-with-title")
    public JobModalWithTitleDTO getJobModalWithTitle(@PathVariable(value = "id") final Long id) {
        return jobService.getJobModalWithTitle(id);
    }

    @GetMapping("/api/protected/jobs/{id}/modal-with-shooter-name")
    public JobModalWithShooterNameDTO getJobModalWithShooterName(@PathVariable(value = "id") final Long id) {
        return jobService.getJobModalWithShooterName(id);
    }

    @PutMapping("/api/protected/jobs/{id}")
    public RestMessageDTO editJob(@PathVariable(value = "id") final Long id, @RequestBody JobDTO jobDTO) {
        return jobService.editJob(id, jobDTO);
    }

    @PutMapping("/api/private/jobs/{id}")
    public RestMessageDTO editJobByAdmin(@PathVariable(value = "id") final Long id, @RequestBody JobDTO jobDTO) {
        return jobService.editJobByAdmin(id, jobDTO);
    }

    @GetMapping("/api/protected/users/jobs")
    public List<JobShortInfoDTO> getOwnJobs() {
        return jobService.getOwnJobs();
    }

    @PostMapping("/api/protected/jobs/{id}/applicants")
    public RestMessageDTO applyForJob(@PathVariable(value = "id") final Long id) {
        return jobService.applyForJob(id);
    }

    @DeleteMapping("/api/protected/jobs/{id}/applicants")
    public RestMessageDTO cancelApplication(@PathVariable(value = "id") final Long id) {
        return jobService.cancelApplication(id);
    }

    @PutMapping("/api/protected/jobs/{jobId}/users/{userId}/mark")
    public RestMessageDTO changeApplicantMark(@PathVariable(value = "jobId") final Long jobId,
        @PathVariable(value = "userId") final Long userId) {
        return jobService.changeApplicantMark(jobId, userId);
    }

    @GetMapping("/api/protected/jobs")
    public List<JobShortInfoDTO> getJobs(SearchRequestDTO searchRequestDTO, @PageableDefault(size = 20) Pageable pageable) {
        return jobService.getJobsByType(searchRequestDTO, pageable);
    }

    @PutMapping("/api/protected/jobs/{id}/cancel")
    public RestMessageDTO cancelJob(@PathVariable(value = "id") final Long id) {
        return jobService.cancelJob(id);
    }

    @PutMapping("/api/protected/jobs/{id}/renew")
    public RestMessageDTO renewJob(@PathVariable(value = "id") final Long id) {
        return jobService.renewJob(id);
    }

    @GetMapping("/api/private/jobs")
    public CompletedJobsInfoDTO getCompletedJobs() {
        return jobService.getCompletedJobs();
    }

    @PutMapping("/api/private/jobs/{id}/done")
    public RestMessageDTO markAsDone(@PathVariable(value = "id") final Long id) {
        return jobService.markAsDone(id);
    }

    @GetMapping("/api/protected/jobs/pre-expire")
    public List<JobBasicInfoDTO> getPreExpireJobList() {
        return jobService.getPreExpireJobList();
    }

    @PostMapping("/api/protected/jobs/{id}/complete")
    public RestMessageDTO createFeedback(@PathVariable(value = "id") final Long jobId, @RequestBody FeedbackDTO feedbackDTO) {
        return jobService.completeJobAndCreateFeedback(jobId, feedbackDTO);
    }

    @InitBinder
    public void initBinder(WebDataBinder dataBinder) {
        dataBinder.registerCustomEditor(JobTabType.class, new JobTabTypeConverter());
    }
}
