package com.sombrainc.service.impl;

import com.sombrainc.dto.CreatedIdDTO;
import com.sombrainc.dto.JobStatisticDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.feedback.FeedbackDTO;
import com.sombrainc.dto.job.*;
import com.sombrainc.dto.search.SearchRequestDTO;
import com.sombrainc.dto.search.SearchResultDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.JobApplicant;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.*;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.Forbidden403Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.*;
import com.sombrainc.service.*;
import com.sombrainc.service.mapper.*;
import com.sombrainc.util.PaymentUtil;
import com.sombrainc.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.BigInteger;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import static com.sombrainc.entity.enumeration.JobStatus.*;
import static com.sombrainc.entity.enumeration.OwnershipType.*;
import static java.util.Comparator.comparing;

@Slf4j
@Service
public class JobServiceImpl implements JobService {

    private static final int EVERY_MINUTE = 60000;

    private static final String EVERY_DAY_AT_1_AM = "0 0 01 * * *";

    private static final String EVERY_HOUR = "0 0 * * * *";

    private static final int COMPLETE_JOB_NOTIFICATION_DAYS = 2;

    private static final int COMPLETE_JOB_AUTOMATICALLY_DAYS = 7;

    private static final int PRE_EXPIRE_JOB_DAYS = 23;

    private static final int EXPIRE_JOB_DAYS = 29;

    private static final int EXPIRE_JOB_30_DAYS = 30;

    private static final String JOB_NOT_FOUND = "Job not found";

    private static final String USER_NOT_FOUND = "User not found";

    private static final String SHOULD_BE_APPLICANT = "User should be applicant of this job";

    private static final String NOT_OWNER = "You are not the owner";

    private static final String NOT_ADMIN = "You are not the admin";

    private static final String APPLICANT_NOT_FOUND = "Applicant for Job not found";

    private static final String JSON_TITLE = "title";

    private static final String UNSUPPORTED_JOB_STATUS = "Job status is unsupported";

    @Autowired
    private UserService userService;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private SubscriptionService subscriptionService;

    @Autowired
    private SearchService searchService;

    @Autowired
    private SearchRepository searchRepository;

    @Autowired
    private JobApplicantRepository jobApplicantRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private FeedbackService feedbackService;

    @Override
    public CreatedIdDTO saveJob(JobDTO jobDTO) {
        LOGGER.info("Saving job: {}", jobDTO);
        subscriptionService.handlePostJob();
        Job job = JobMapper.INSTANCE.map(jobDTO);
        job.setOwner(userService.getCurrentUser());
        job.setLastAction(LocalDate.now());
        changeJobStatus(job, NEW);
        sendNotificationAboutNewJobInRadius(job);
        LOGGER.info("Job with id: {} was successfully saved by user: {}", job.getId(), userService.getCurrentUserEmail());
        return CreatedIdDTO.of(job.getId());
    }

    private void sendNotificationAboutNewJobInRadius(Job job) {
        Set<BigInteger> ids = searchRepository
            .findClosestUsers(job.getLatitude(), job.getLongitude(),
                List.of(UserStatus.VERIFICATION_SUCCESS.name(), UserStatus.EDITED.name()), WorkerRole.of(job.getWorkerRoles()))
            .stream()
            .map(SearchResultDTO::getId)
            .collect(Collectors.toSet());
        for (BigInteger id : ids) {
            User user = userRepository.findById(id.longValue()).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
            if (user != job.getOwner()) {
                if (user.getSettings().isPush()) {
                    notificationService.sendNewJobInRadiusNotification(user, job.getId());
                }
                if (user.getSettings().isEmail()) {
                    emailService.sendJobAlertEmail(job, user.getEmail());
                }
            }
        }
    }

    @Override
    public JobViewDTO getJob(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        JobViewDTO jobViewDTO = JobViewDTOMapper.INSTANCE.map(job);
        if (isJobOwner(job)) {
            jobViewDTO.setOwnershipType(OwnershipType.OWNER.name());
            jobViewDTO.setApplicants(getApplicantDTOsFromJob(job));
        } else {
            if (isOfferDeclined(job)) {
                jobViewDTO.setOwnershipType(OFFER_DECLINED.name());
            } else {
                if (isApplicant(job)) {
                    jobViewDTO.setOwnershipType(OwnershipType.APPLICANT.name());
                }
                if (isChosenApplicant(job)) {
                    jobViewDTO.setOwnershipType(CHOSEN_APPLICANT.name());
                    jobViewDTO.setOwnerId(job.getOwner().getId().toString());
                }
                if (isShooter(job)) {
                    jobViewDTO.setOwnershipType(OwnershipType.SHOOTER.name());
                    jobViewDTO.setOwnerId(job.getOwner().getId().toString());
                }
            }
        }
        if (isAdmin()) {
            jobViewDTO.setApplicants(getApplicantDTOsFromJob(job));
        }
        String email = userService.getCurrentUserEmail();
        boolean reachedLimit = subscriptionService.hasReachedLimit(email);
        if (reachedLimit) {
            jobViewDTO.setOwnerName(StringUtils.EMPTY);
        }
        return jobViewDTO;
    }

    private List<ApplicantDTO> getApplicantDTOsFromJob(Job job) {
        List<User> declinedOffer = offerRepository.findUsersWithDeclinedOffers(job);
        return jobApplicantRepository
            .findAllByJob(job)
            .stream()
            .filter(jobApplicant -> !declinedOffer.contains(jobApplicant.getApplicant()))
            .sorted(comparing(JobApplicant::getDate).reversed())
            .map(ApplicantDTOMapper.INSTANCE::map)
            .sorted(comparing(ApplicantDTO::isHired).reversed())
            .collect(Collectors.toList());
    }

    @Override
    public RestMessageDTO editJob(Long jobId, JobDTO jobDTO) {
        LOGGER.info("Editing job with id: {} to job: {}", jobId, jobDTO);
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (job.getJobStatus() != NEW && job.getJobStatus() != JobStatus.WAITING_FOR_RESPONSE) {
            throw new Forbidden403Exception("Crew has accepted the Job. You cannot update it. Contact Admin.");
        }
        User user = userService.getCurrentUser();
        if (!user.equals(job.getOwner())) {
            throw new Forbidden403Exception(NOT_OWNER);
        }
        job.setOwnerType(jobDTO.getOwnerType());
        job.setTitle(jobDTO.getTitle());
        job.setDate(jobDTO.getDate());
        job.setLatitude(new BigDecimal(jobDTO.getLocationDTO().getLat()));
        job.setLongitude(new BigDecimal(jobDTO.getLocationDTO().getLng()));
        job.setAddress(jobDTO.getLocationDTO().getAddress());
        job.setWorkerRoles(WorkerRole.ofRoles(jobDTO.getWorkerRoles()));
        job.setBrief(jobDTO.getBrief());
        job.setEquipment(jobDTO.getEquipment());
        job.setPricePerHour(new BigDecimal(jobDTO.getPricePerHour()));
        job.setNumberOfHours(new BigDecimal(jobDTO.getNumberOfHour()));
        job.setAttachment(jobDTO.getAttachment());
        job.setLastAction(LocalDate.now());
        jobRepository.save(job);
        if (job.getJobApplicants() != null && !job.getJobApplicants().isEmpty()) {
            notifyApplicants(job);
        }
        LOGGER.info("Job with id: {} was successfully edited by user: {}", jobId, user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Job successfully updated");
    }

    @Override
    public RestMessageDTO editJobByAdmin(Long jobId, JobDTO jobDTO) {
        LOGGER.info("Editing job with id: {} to job: {}", jobId, jobDTO);
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (job.getJobStatus() != NEW && job.getJobStatus() != JobStatus.WAITING_FOR_RESPONSE) {
            throw new Forbidden403Exception("Crew has accepted the Job. You cannot update it. Contact Admin.");
        }
        User user = userService.getCurrentUser();
        if (user.getRole() != Role.ROLE_ADMIN) {
            throw new Forbidden403Exception(NOT_ADMIN);
        }
        job.setOwnerType(jobDTO.getOwnerType());
        job.setTitle(jobDTO.getTitle());
        job.setDate(jobDTO.getDate());
        job.setLatitude(new BigDecimal(jobDTO.getLocationDTO().getLat()));
        job.setLongitude(new BigDecimal(jobDTO.getLocationDTO().getLng()));
        job.setAddress(jobDTO.getLocationDTO().getAddress());
        job.setWorkerRoles(WorkerRole.ofRoles(jobDTO.getWorkerRoles()));
        job.setBrief(jobDTO.getBrief());
        job.setEquipment(jobDTO.getEquipment());
        job.setPricePerHour(new BigDecimal(jobDTO.getPricePerHour()));
        job.setNumberOfHours(new BigDecimal(jobDTO.getNumberOfHour()));
        job.setAttachment(jobDTO.getAttachment());
        job.setLastAction(LocalDate.now());
        jobRepository.save(job);
        if (job.getJobApplicants() != null && !job.getJobApplicants().isEmpty()) {
            notifyApplicants(job);
        }
        LOGGER.info("Job with id: {} was successfully edited by user: {}", jobId, user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Job successfully updated");
    }

    private void notifyApplicants(Job job) {
        job
            .getJobApplicants()
            .forEach(jobApplicant -> notificationService.sendJobEditNotification(job.getId(), jobApplicant.getApplicant()));
    }

    @Override
    public List<JobShortInfoDTO> getOwnJobs() {
        User user = userService.getCurrentUser();
        List<Job> jobs = jobRepository.findJobsByOwnerEqualsOrderByDateAsc(user);
        List<JobShortInfoDTO> jobShortInfoDTOS = new ArrayList<>();
        for (Job job : jobs) {
            JobShortInfoDTO jobShortInfoDTO = JobShortInfoDTOMapper.INSTANCE.map(job);
            jobShortInfoDTO.setOwnershipType(OwnershipType.OWNER.name());
            jobShortInfoDTO.setApplicants(String.valueOf(jobRepository.countJobApplicants(job)));
            User shooter = job.getShooter();
            if (shooter != null) {
                jobShortInfoDTO.setShooterId(shooter.getId().toString());
                jobShortInfoDTO.setShooterFullName(UserUtil.concatStrings(shooter.getFirstName(), shooter.getLastName()));
            }
            jobShortInfoDTOS.add(jobShortInfoDTO);
        }
        return jobShortInfoDTOS;
    }

    private boolean isJobOwner(Job job) {
        return userService.getCurrentUser().getId().equals(job.getOwner().getId());
    }

    private boolean isAdmin() {
        return userService.getCurrentUser().getRole() == Role.ROLE_ADMIN;
    }

    private boolean isShooter(Job job) {
        return userService.getCurrentUser().equals(job.getShooter());
    }

    private boolean isOfferDeclined(Job job) {
        return offerRepository.findByJobAndShooterAndAcceptedIsFalse(job, userService.getCurrentUser()).isPresent();
    }

    private boolean isApplicant(Job job) {
        return jobApplicantRepository.findByJobAndApplicant(job, userService.getCurrentUser()).isPresent();
    }

    private boolean isChosenApplicant(Job job) {
        return offerRepository.findByJobAndShooter(job, userService.getCurrentUser()).isPresent();
    }

    @Override
    public RestMessageDTO applyForJob(Long id) {
        LOGGER.info("Applying for the job with id: {}", id);
        subscriptionService.handleApplication();
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        User user = userService.getCurrentUser();
        if (user.equals(job.getOwner())) {
            throw new BadRequest400Exception("Owner can't apply for his job");
        }
        if (jobApplicantRepository.findByJobAndApplicant(job, user).isPresent()) {
            throw new BadRequest400Exception("You already applied for this job");
        }
        JobApplicant jobApplicant = JobApplicant.createJobApplicant(job, user);
        jobApplicantRepository.save(jobApplicant);
        notificationService.sendNewApplicantsNotification(id, job.getTitle(), job.getOwner());
        LOGGER.info("User: {} successfully applied for the job with id: {}", user.getEmail(), id);
        return RestMessageDTO.createSuccessRestMessageDTO("job_view.apply_job.message_success");
    }

    @Override
    public RestMessageDTO cancelApplication(Long id) {
        LOGGER.info("Canceling application for the job with id: {}", id);
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        User user = userService.getCurrentUser();
        if (offerRepository.findByJobAndShooter(job, user).isPresent()) {
            throw new BadRequest400Exception("You can't do this action");
        }
        JobApplicant jobApplicant = jobApplicantRepository
            .findByJobAndApplicant(job, user)
            .orElseThrow(() -> new NotFound404Exception(APPLICANT_NOT_FOUND));
        jobApplicantRepository.delete(jobApplicant);
        LOGGER.info("User: {} successfully canceled application for the job with id: {}", user.getEmail(), id);
        return RestMessageDTO.createSuccessRestMessageDTO("job_view.cancel_applications.message_success");
    }

    @Override
    public List<JobShortInfoDTO> getJobsByType(SearchRequestDTO searchRequestDTO, Pageable pageable) {
        switch (searchRequestDTO.getTab()) {
            case AVAILABLE:
                return searchService.getAvailableJobs(searchRequestDTO, pageable);
            case MY_APPLICATIONS:
                return getMyApplicationsJobs(pageable);
            case UPCOMING:
                return getUpcomingJobs(pageable);
            case ARCHIVED:
                return getArchivedJobs(pageable);
            default:
                throw new BadRequest400Exception("Unsupported type of tab");
        }
    }

    @Override
    public RestMessageDTO changeApplicantMark(Long jobId, Long applicantId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        User user = userRepository.findById(applicantId).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
        if (!userService.getCurrentUser().equals(job.getOwner())) {
            throw new BadRequest400Exception(NOT_OWNER);
        }
        if (!jobApplicantRepository.findByJobAndApplicant(job, user).isPresent()) {
            throw new BadRequest400Exception(SHOULD_BE_APPLICANT);
        }
        JobApplicant jobApplicant = jobApplicantRepository
            .findByJobAndApplicant(job, user)
            .orElseThrow(() -> new NotFound404Exception(APPLICANT_NOT_FOUND));
        if (jobApplicant.isMarked()) {
            jobApplicant.setMarked(false);
        } else {
            jobApplicant.setMarked(true);
        }
        jobApplicantRepository.save(jobApplicant);
        LOGGER.info("Marker successfully changed for job with id: {} to user: {}", jobId, user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Applicant mark successfully changed");
    }

    @Override
    public void changeJobStatus(Job job, JobStatus jobStatus) {
        job.setJobStatus(jobStatus);
        jobRepository.save(job);
    }

    private List<JobShortInfoDTO> getMyApplicationsJobs(Pageable pageable) {
        User user = userService.getCurrentUser();
        List<String> jobsWithOffers = offerRepository
            .findByShooter(user)
            .stream()
            .map(offer -> offer.getJob().getId().toString())
            .collect(Collectors.toList());
        return jobRepository
            .findByStatusNotOwnerAndApplicant(List.of(NEW, WAITING_FOR_RESPONSE), user, pageable)
            .stream()
            .map(JobShortInfoDTOMapper.INSTANCE::map)
            .map(job -> setOwnershipTypeForApplicant(job, jobsWithOffers))
            .collect(Collectors.toList());
    }

    private JobShortInfoDTO setOwnershipTypeForApplicant(JobShortInfoDTO jobShortInfoDTO, List<String> jobsWithOffers) {
        if (jobsWithOffers.contains(jobShortInfoDTO.getId())) {
            jobShortInfoDTO.setOwnershipType(CHOSEN_APPLICANT.name());
        } else {
            jobShortInfoDTO.setOwnershipType(APPLICANT.name());
        }
        return jobShortInfoDTO;
    }

    private List<JobShortInfoDTO> getUpcomingJobs(Pageable pageable) {
        User user = userService.getCurrentUser();
        return jobRepository
            .findByJobStatusInAndShooterIsAndOwnerIsNot(List.of(OFFER_ACCEPTED, IN_PROGRESS), user, pageable)
            .stream()
            .map(JobShortInfoDTOMapper.INSTANCE::map)
            .map(this::setOwnershipTypeForActiveJob)
            .collect(Collectors.toList());
    }

    private JobShortInfoDTO setOwnershipTypeForActiveJob(JobShortInfoDTO jobShortInfoDTO) {
        jobShortInfoDTO.setOwnershipType(SHOOTER.name());
        return jobShortInfoDTO;
    }

    private List<JobShortInfoDTO> getArchivedJobs(Pageable pageable) {
        User user = userService.getCurrentUser();
        return jobRepository
            .findArchivedJobs(List.of(NEW, WAITING_FOR_RESPONSE), user, List.of(COMPLETED, DONE, CANCELLED), pageable)
            .stream()
            .map(JobShortInfoDTOMapper.INSTANCE::map)
            .map(this::setOwnershipTypeForArchiveJob)
            .collect(Collectors.toList());
    }

    private JobShortInfoDTO setOwnershipTypeForArchiveJob(JobShortInfoDTO jobShortInfoDTO) {
        if (isOfferDeclined(
            jobRepository.findById(Long.valueOf(jobShortInfoDTO.getId())).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND)))) {
            jobShortInfoDTO.setOwnershipType(OFFER_DECLINED.name());
        } else {
            jobShortInfoDTO.setOwnershipType(SHOOTER.name());
        }
        return jobShortInfoDTO;
    }

    @Override
    public Map<String, String> getTitleByJobId(Long id) {
        String title = jobRepository.findTitleById(id);
        return Map.of(JSON_TITLE, title);
    }

    @Override
    public JobModalWithTitleDTO getJobModalWithTitle(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        return JobModalWithTitleDTO.builder().title(job.getTitle()).date(job.getDate()).amount(PaymentUtil.getAmount(job)).build();
    }

    @Override
    public JobModalWithShooterNameDTO getJobModalWithShooterName(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        return JobModalWithShooterNameDTOMapper.INSTANCE.map(job);
    }

    @Override
    public RestMessageDTO cancelJob(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!userService.getCurrentUser().equals(job.getOwner())) {
            throw new BadRequest400Exception(NOT_OWNER);
        }
        if (job.getJobStatus().equals(CANCELLED)) {
            throw new BadRequest400Exception("This job already canceled");
        }
        if (!(job.getJobStatus().equals(NEW) || job.getJobStatus().equals(WAITING_FOR_RESPONSE))) {
            throw new BadRequest400Exception(UNSUPPORTED_JOB_STATUS);
        }
        if (job.getJobStatus().equals(WAITING_FOR_RESPONSE)) {
            offerRepository.findByJobAndAcceptedIsNull(job).ifPresent(offerRepository::delete);
        }
        changeJobStatus(job, CANCELLED);
        notifyAboutCancel(job);
        LOGGER.info("Job with id: {} successfully canceled", id);
        return RestMessageDTO.createSuccessRestMessageDTO("Job successfully canceled");
    }

    @Override
    public RestMessageDTO renewJob(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!userService.getCurrentUser().equals(job.getOwner())) {
            throw new BadRequest400Exception(NOT_OWNER);
        }
        if (!(job.getJobStatus().equals(NEW) || job.getJobStatus().equals(CANCELLED))) {
            throw new BadRequest400Exception(UNSUPPORTED_JOB_STATUS);
        }
        if (!(job.getLastAction().isBefore(LocalDate.now().minusDays(PRE_EXPIRE_JOB_DAYS)))) {
            throw new BadRequest400Exception("renew_job.cant_renew");
        }
        if (ChronoUnit.DAYS.between(LocalDate.now(), job.getDate()) < EXPIRE_JOB_DAYS) {
            throw new BadRequest400Exception("renew_job.not_enough_days");
        }
        job.setLastAction(LocalDate.now());
        changeJobStatus(job, NEW);
        LOGGER.info("Job with id: {} successfully renewed", id);
        return RestMessageDTO.createSuccessRestMessageDTO("Job successfully renewed");
    }

    @Override
    public RestMessageDTO completeJobAndCreateFeedback(Long jobId, FeedbackDTO feedbackDTO) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!(job.getJobStatus().equals(OFFER_ACCEPTED) || job.getJobStatus().equals(IN_PROGRESS))) {
            throw new BadRequest400Exception(UNSUPPORTED_JOB_STATUS);
        }
        feedbackService.createFeedbackForShooter(feedbackDTO, job);
        changeJobStatus(job, COMPLETED);
        LOGGER.info("Job with id: {} completed successfully", job.getId());
        return RestMessageDTO.createSuccessRestMessageDTO("Job successfully completed");
    }

    @Override
    public List<JobBasicInfoDTO> getPreExpireJobList() {
        List<Job> jobs = jobRepository.findByOwnerAndJobStatusEqualsAndLastActionIn(userService.getCurrentUser(), NEW, LocalDate
            .now()
            .minusDays(EXPIRE_JOB_DAYS)
            .datesUntil(LocalDate.now().minusDays(PRE_EXPIRE_JOB_DAYS))
            .collect(Collectors.toList()));
        return jobs.stream().map(JobBasicInfoDTOMapper.INSTANCE::map).collect(Collectors.toList());
    }

    @Scheduled(fixedDelay = EVERY_MINUTE)
    private void setJobInProgress() {
        List<Job> jobs = jobRepository.findByJobStatusEqualsAndDate(OFFER_ACCEPTED, LocalDate.now());
        for (Job job : jobs) {
            changeJobStatus(job, IN_PROGRESS);
            LOGGER.info("Job status for job with id: {} changed to IN_PROGRESS", job.getId());
        }
    }

    @Scheduled(cron = EVERY_DAY_AT_1_AM)
    private void completeJobNotificationAndAutoComplete() {
        jobAutoComplete();
        completeJobNotification();
    }

    @Scheduled(cron = EVERY_DAY_AT_1_AM)
    private void expireNotificationAfter23Days() {
        List<Job> jobs = jobRepository.findByJobStatusEqualsAndLastAction(NEW, LocalDate.now().minusDays(PRE_EXPIRE_JOB_DAYS));
        jobs.forEach(job -> emailService.sendJobExpiring(job));
    }

    @Scheduled(cron = EVERY_DAY_AT_1_AM)
    private void expireJobAfter30Days() {
        List<Job> jobs = jobRepository.findByJobStatusEqualsAndLastActionLessThanEqual(NEW, LocalDate.now().minusDays(EXPIRE_JOB_30_DAYS));
        for (Job job : jobs) {
            changeJobStatus(job, CANCELLED);
            notifyAboutCancel(job);
            LOGGER.info("Job with id: {} expired after 30 days", job.getId());
        }
    }

    @Scheduled(cron = EVERY_HOUR)
    private void jobAutoCancel() {
        List<Job> jobs = jobRepository.findByJobStatusIn(List.of(NEW, WAITING_FOR_RESPONSE));
        LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault()).withSecond(0).withNano(0);
        LOGGER.info("job auto cancel job started: " + now.toString());
        for (Job job : jobs) {
            LocalDateTime zonedJobDate = convertToOwnerTimezone(job.getDate(), job.getOwner().getUserProfile().getTimezone());
            LOGGER.info("converted time zone: " + zonedJobDate);
            if (zonedJobDate.equals(now)) {
                changeJobStatus(job, CANCELLED);
                notifyAboutCancel(job);
                LOGGER.info("Job with id: {} automatically canceled successfully", job.getId());
            }
        }
    }

    private void completeJobNotification() {
        List<Job> autoCompleteJobs = jobRepository.findByJobStatusEqualsAndDate(IN_PROGRESS,
            LocalDate.now().minusDays(COMPLETE_JOB_NOTIFICATION_DAYS));
        autoCompleteJobs.forEach(j -> emailService.sendCompleteJobEmail(j));
    }

    private void jobAutoComplete() {
        List<Job> jobs = jobRepository.findByJobStatusEqualsAndDateLessThanEqual(IN_PROGRESS,
            LocalDate.now().minusDays(COMPLETE_JOB_AUTOMATICALLY_DAYS));
        for (Job job : jobs) {
            changeJobStatus(job, COMPLETED);
            LOGGER.info("Job with id: {} automatically completed successfully", job.getId());
        }
    }

    @Override
    public CompletedJobsInfoDTO getCompletedJobs() {
        List<CompletedJobDTO> pending = jobRepository
            .findByJobStatusIs(COMPLETED)
            .stream()
            .map(CompletedJobDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
        List<CompletedJobDTO> closed = jobRepository
            .findByJobStatusIs(DONE)
            .stream()
            .map(CompletedJobDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
        List<CompletedJobDTO> all = jobRepository.findAll().stream().map(CompletedJobDTOMapper.INSTANCE::map).collect(Collectors.toList());
        return CompletedJobsInfoDTO
            .builder()
            .pendingCounter(pending.size())
            .closedCounter(closed.size())
            .allCounter(all.size())
            .completedJobDTOList(pending)
            .doneJobDTOList(closed)
            .allJobDTOList(all)
            .build();
    }

    @Override
    public RestMessageDTO markAsDone(Long id) {
        Job job = jobRepository.findById(id).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!COMPLETED.equals(job.getJobStatus())) {
            throw new BadRequest400Exception("Incorrect job status");
        } else {
            jobRepository.markAsDone(id, DONE);
            LOGGER.info("Job with id: {} successfully marked us done", id);
        }
        return RestMessageDTO.createSuccessRestMessageDTO("Job successfully marked as done");
    }

    @Override
    public JobStatisticDTO getJobsStatistic() {
        User user = userService.getCurrentUser();
        int myApplications = jobRepository.countMyApplications(List.of(NEW, WAITING_FOR_RESPONSE), user);
        int activeJobs = jobRepository.countActiveJobs(List.of(OFFER_ACCEPTED, IN_PROGRESS), user);
        int pendingJobs = jobRepository.countPendingJobs(user, List.of(NEW, WAITING_FOR_RESPONSE));
        int totalApplicants = jobRepository.countTotalApplicants(user);
        return JobStatisticDTO
            .builder()
            .myApplications(myApplications)
            .activeJobs(activeJobs)
            .pendingJobs(pendingJobs)
            .totalApplicants(totalApplicants)
            .build();
    }

    private static LocalDateTime convertToOwnerTimezone(LocalDate jobDate, String zoneId) {
        ZoneId userTimeZone = ZoneId.of(zoneId);
        return jobDate.plusDays(1).atStartOfDay().atZone(userTimeZone).withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
    }

    @Override
    public JobShortInfoDTO hideOwnerName(JobShortInfoDTO jobShortInfoDTO) {
        String email = userService.getCurrentUserEmail();
        boolean reachedLimit = subscriptionService.hasReachedLimit(email);
        if (reachedLimit) {
            jobShortInfoDTO.setOwnerType(StringUtils.EMPTY);
        }
        return jobShortInfoDTO;
    }

    private void notifyAboutCancel(Job job) {
        job
            .getJobApplicants()
            .forEach(jobApplicant -> notificationService.sendApplicationUpdateNotification(jobApplicant.getApplicant(), job.getTitle()));
    }
}
