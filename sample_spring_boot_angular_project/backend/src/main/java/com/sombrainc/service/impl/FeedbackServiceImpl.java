package com.sombrainc.service.impl;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.feedback.FeedbackDTO;
import com.sombrainc.dto.feedback.FeedbackDataDTO;
import com.sombrainc.dto.feedback.FeedbackTextDTO;
import com.sombrainc.dto.job.JobModalForFeedbackDTO;
import com.sombrainc.entity.Feedback;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.FeedbackType;
import com.sombrainc.entity.enumeration.Star;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.FeedbackRepository;
import com.sombrainc.repository.JobRepository;
import com.sombrainc.service.FeedbackService;
import com.sombrainc.service.SubscriptionService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.JobModalForFeedbackDTOMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.stream.Collectors;

import static com.sombrainc.entity.enumeration.JobStatus.COMPLETED;
import static com.sombrainc.entity.enumeration.JobStatus.DONE;

@Slf4j
@Service
public class FeedbackServiceImpl implements FeedbackService {

    private static final String JOB_NOT_FOUND = "Job not found";

    private static final double NEW_CREW = 0;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private UserService userService;

    @Override
    public List<FeedbackTextDTO> getFeedbackList(Long profileId, Pageable pageable) {
        return feedbackRepository
            .findAllByReceiver_UserProfile_Id(profileId, pageable)
            .stream()
            .map(FeedbackTextDTO::of)
            .collect(Collectors.toList());
    }

    @Override
    public FeedbackDataDTO getFeedbackData(Long profileId) {
        List<Feedback> feedbackList = feedbackRepository.findAllByReceiver_UserProfile_Id(profileId);
        double average = feedbackList.stream().mapToInt(feedback -> feedback.getStar().getValue()).average().orElse(NEW_CREW);
        BigDecimal averageScaled = BigDecimal.valueOf(average).setScale(2, RoundingMode.HALF_EVEN);
        return FeedbackDataDTO.of(averageScaled, feedbackList.size());
    }

    @Override
    public RestMessageDTO createFeedbackForBusiness(FeedbackDTO feedbackDTO, Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (feedbackRepository.findByJobAndAuthor(job, job.getShooter()).isPresent()) {
            throw new BadRequest400Exception("You already created feedback for this user");
        }
        if (!userService.getCurrentUser().equals(job.getShooter())) {
            throw new BadRequest400Exception("You are not the shooter of this job");
        }
        if (!(job.getJobStatus().equals(COMPLETED) || job.getJobStatus().equals(DONE))) {
            throw new BadRequest400Exception("Job status is unsupported");
        }
        Feedback feedback = Feedback.createFeedback(Star.of(feedbackDTO.getStar()), feedbackDTO.getReview(), job, job.getShooter(),
            job.getOwner(), FeedbackType.AS_CREW);
        feedbackRepository.save(feedback);
        LOGGER.info("Feedback successfully created by shooter: {} to business: {}", feedback.getAuthor().getEmail(),
            feedback.getReceiver().getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Feedback for business successfully created");
    }

    @Override
    public void createFeedbackForShooter(FeedbackDTO feedbackDTO, Job job) {
        if (feedbackRepository.findByJobAndAuthor(job, job.getOwner()).isPresent()) {
            throw new BadRequest400Exception("You already created feedback for this user");
        }
        if (!userService.getCurrentUser().equals(job.getOwner())) {
            throw new BadRequest400Exception("You are not the owner of this job");
        }
        Feedback feedback = Feedback.createFeedback(Star.of(feedbackDTO.getStar()), feedbackDTO.getReview(), job, job.getOwner(),
            job.getShooter(), FeedbackType.AS_BUSINESS);
        feedbackRepository.save(feedback);
        LOGGER.info("Feedback successfully created by business: {} to shooter: {}", feedback.getAuthor().getEmail(),
            feedback.getReceiver().getEmail());
    }

    @Override
    public List<JobModalForFeedbackDTO> getJobsForBusinessFeedback() {
        User user = userService.getCurrentUser();
        List<Job> jobs = feedbackRepository.findJobsForBusinessFeedback(user, List.of(COMPLETED, DONE));
        return jobs.stream().map(JobModalForFeedbackDTOMapper.INSTANCE::map).collect(Collectors.toList());
    }

    @Override
    public RestMessageDTO createFeedbackForShooterAfterAutoComplete(FeedbackDTO feedbackDTO, Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!(job.getJobStatus().equals(COMPLETED))) {
            throw new BadRequest400Exception("Job status is unsupported");
        }
        createFeedbackForShooter(feedbackDTO, job);
        return RestMessageDTO.createSuccessRestMessageDTO("Feedback for shooter successfully created");
    }

    @Override
    public List<JobModalForFeedbackDTO> getJobsForShooterFeedback() {
        User user = userService.getCurrentUser();
        List<Job> jobs = feedbackRepository.findJobsForShooterFeedback(user, List.of(COMPLETED, DONE));
        return jobs.stream().map(JobModalForFeedbackDTOMapper.INSTANCE::map).collect(Collectors.toList());
    }

}
