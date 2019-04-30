package com.sombrainc.service.impl;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.Offer;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.entity.enumeration.PaymentStatus;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.JobApplicantRepository;
import com.sombrainc.repository.JobRepository;
import com.sombrainc.repository.OfferRepository;
import com.sombrainc.repository.UserProfileRepository;
import com.sombrainc.service.*;
import com.sombrainc.util.PaymentUtil;
import com.sombrainc.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Slf4j
@EnableScheduling
@Service
public class OfferServiceImpl implements OfferService {

    private static final int EVERY_MINUTE = 60000;

    private static final int OFFER_EXPIRED_HOURS = 48;

    private static final String JOB_NOT_FOUND = "Job not found";

    private static final String OFFER_NOT_FOUND = "Offer not found";

    private static final String PROFILE_NOT_FOUND = "User profile not found";

    private static final String EVERY_DAY_AT_1_AM = "0 0 01 * * *";

    private static final String NOT_SUPPORTED_JOB_STATUS = "Job status not supported for sending offer";

    private static final String USER_NOT_APPLIED = "This user isn't applied to this job, so you can't send offer to him";

    private static final String OFFER_ALREADY_SENT = "You already sent offer to this user";

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private JobApplicantRepository jobApplicantRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private JobService jobService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private NotificationService notificationService;

    @Override
    public RestMessageDTO createOfferWithStripe(Long jobId, Long profileId, String token, boolean fullCharge) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!job.getJobStatus().equals(JobStatus.NEW)) {
            throw new BadRequest400Exception(NOT_SUPPORTED_JOB_STATUS);
        }
        User user = userProfileRepository.findById(profileId).orElseThrow(() -> new NotFound404Exception(PROFILE_NOT_FOUND)).getUsers();
        if (!jobApplicantRepository.findByJobAndApplicant(job, user).isPresent()) {
            throw new BadRequest400Exception(USER_NOT_APPLIED);
        }
        if (offerRepository.findByJobAndShooter(job, user).isPresent()) {
            throw new BadRequest400Exception(OFFER_ALREADY_SENT);
        }
        User owner = job.getOwner();
        String description = PaymentUtil.createPaymentDescription(owner, job, user);
        String stripeCustomerId = paymentService.createStripeCustomer(token);
        String chargeId = paymentService.createStripeCharge(job.getPricePerHour(), job.getNumberOfHours(), description, stripeCustomerId,
            fullCharge, owner.getEmail());
        Offer offer = Offer.createOfferWithStripe(job, user, stripeCustomerId, chargeId, fullCharge);
        offerRepository.save(offer);
        job.setLastAction(LocalDate.now());
        jobService.changeJobStatus(job, JobStatus.WAITING_FOR_RESPONSE);
        emailService.sendJobOfferSentEmail(user, job);
        notificationService.sendJobOfferNotification(jobId, user);
        LOGGER.info("Offer for job with id: {} successfully created and sent to user: {}", jobId, user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Offer successfully sent");
    }

    @Override
    public RestMessageDTO declineOffer(Long jobId) {
        User user = userService.getCurrentUser();
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        Offer offer = offerRepository
            .findByJobAndShooterAndAcceptedIsNull(job, user)
            .orElseThrow(() -> new NotFound404Exception(OFFER_NOT_FOUND));
        declineOffer(offer);
        emailService.sendJobOfferDeclinedEmail(offer);
        LOGGER.info("Offer with id: {} successfully declined", offer.getId());
        return RestMessageDTO.createSuccessRestMessageDTO("Offer successfully declined");
    }

    @Scheduled(fixedDelay = EVERY_MINUTE)
    public void declineOfferAfterExpired() {
        List<Offer> offers = offerRepository.findAllByAcceptedIsNullAndDateBefore(LocalDateTime.now().minusHours(OFFER_EXPIRED_HOURS));
        for (Offer offer : offers) {
            declineOffer(offer);
            emailService.sendJobOfferExpiredEmail(offer);
            LOGGER.info("Offer with id: {} successfully expired", offer.getId());
        }
    }

    @Scheduled(cron = EVERY_DAY_AT_1_AM)
    public void chargeRemainingBalance() {
        LOGGER.info("scheduled job - charge remaining balance");
        final LocalDate localDatePlus14Day = LocalDate.now().plusDays(14);
        List<Job> jobs = jobRepository.findByDateAndJobStatus(localDatePlus14Day, JobStatus.OFFER_ACCEPTED);
        List<Offer> offers = offerRepository.findByJobIn(jobs);
        for (Offer offer : offers) {
            Job job = offer.getJob();
            User shooter = offer.getShooter();
            User owner = job.getOwner();
            String description = PaymentUtil.createPaymentDescription(owner, job, shooter);
            if (Objects.nonNull(offer.getFirstStripeChargeId()) && Objects.isNull(offer.getGoCardlessMandateId())
                && !offer.getFullAmountCharge()) {
                LOGGER.info("Charge second payment via Stripe for: {}", offer.getId());
                final String chargeId = paymentService.createStripeCharge(job.getPricePerHour(), job.getNumberOfHours(), description,
                    offer.getStripeCustomerId(), offer.getFullAmountCharge(), owner.getEmail());
                offer.setSecondStripeChargeId(chargeId);
            } else if (Objects.nonNull(offer.getGoCardlessMandateId()) && Objects.isNull(offer.getFirstStripeChargeId())) {
                LOGGER.info("Charge second payment via GoCardless for: {}", offer.getId());
                final String paymentId = paymentService.createPaymentWithGoCardless(offer.getGoCardlessMandateId(), job.getPricePerHour(),
                    job.getNumberOfHours());
                offer.setGoCardlessSecondPaymentId(paymentId);
            }
            offerRepository.save(offer);
            emailService.sendJobOfferPayedOutEmail(shooter, offer);
            notificationService.sendOfferPayedOutNotification(job.getOwner(), job.getTitle(),
                UserUtil.concatStrings(shooter.getFirstName(), shooter.getLastName()), job.getId());
            LOGGER.info("Offer for job with id {} payed out by {}", job.getId(), shooter.getEmail());
        }
    }

    private void declineOffer(Offer offer) {
        User shooter = offer.getShooter();
        Job job = offer.getJob();
        if (Objects.nonNull(offer.getFirstStripeChargeId()) && Objects.isNull(offer.getGoCardlessMandateId())) {
            paymentService.createRefund(offer.getFirstStripeChargeId());
            if (Objects.nonNull(offer.getSecondStripeChargeId()) && !offer.getFullAmountCharge()) {
                paymentService.createRefund(offer.getSecondStripeChargeId());
            }
        }
        offerRepository.delete(offer);
        jobService.changeJobStatus(job, JobStatus.NEW);
        notificationService.sendOfferDeclinedNotification(job.getOwner(), job.getTitle(),
            UserUtil.concatStrings(shooter.getFirstName(), shooter.getLastName()), job.getId());
    }

    @Override
    public RestMessageDTO acceptOffer(Long jobId) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!offerRepository.findByJobAndAcceptedIsNull(job).isPresent()) {
            throw new BadRequest400Exception("Job was cancelled");
        }
        User user = userService.getCurrentUser();
        Offer offer = offerRepository
            .findByJobAndShooterAndAcceptedIsNull(job, user)
            .orElseThrow(() -> new NotFound404Exception(OFFER_NOT_FOUND));
        if (offer.getGoCardlessMandateId() != null) {
            String paymentId = paymentService.createPaymentWithGoCardless(offer.getGoCardlessMandateId(), job.getPricePerHour(),
                job.getNumberOfHours());
            offer.setGoCardlessFirstPaymentId(paymentId);
        }
        offer.setAccepted(Boolean.TRUE);
        offerRepository.save(offer);
        job.setShooter(user);
        jobService.changeJobStatus(job, JobStatus.OFFER_ACCEPTED);
        emailService.sendJobOfferAcceptedEmail(user, job);
        notificationService.sendOfferAcceptedNotification(job.getOwner(), job.getTitle(),
            UserUtil.concatStrings(user.getFirstName(), user.getLastName()), job.getId());
        notifyUnsuccessfulApply(job, user);
        LOGGER.info("Offer for job with id {} accepted by {}", jobId, user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Offer successfully accepted");
    }

    private void notifyUnsuccessfulApply(Job job, User shooter) {
        job
            .getJobApplicants()
            .stream()
            .filter(jobApplicant -> !jobApplicant.getApplicant().equals(shooter))
            .forEach(jobApplicant -> notificationService.sendApplicationUpdateNotification(jobApplicant.getApplicant(), job.getTitle()));
    }

    @Override
    public String createOfferWithGoCardless(final Long jobId, final Long profileId, final String successRedirectUrl) {
        Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
        if (!job.getJobStatus().equals(JobStatus.NEW)) {
            throw new BadRequest400Exception(NOT_SUPPORTED_JOB_STATUS);
        }
        User user = userProfileRepository.findById(profileId).orElseThrow(() -> new NotFound404Exception(PROFILE_NOT_FOUND)).getUsers();
        if (!jobApplicantRepository.findByJobAndApplicant(job, user).isPresent()) {
            throw new BadRequest400Exception(USER_NOT_APPLIED);
        }
        if (offerRepository.findByJobAndShooter(job, user).isPresent()) {
            throw new BadRequest400Exception(OFFER_ALREADY_SENT);
        }
        if (job.getDate().minusDays(14).isBefore(LocalDate.now())) {
            throw new BadRequest400Exception("You can't create payment with GoCardless in 14 days before job,use stripe");
        }
        return paymentService.createGoCardlessClientForRedirectFlow(successRedirectUrl);
    }

    @Override
    public RestMessageDTO completeGoCardlessRedirectFlow(final Long jobId, final Long profileId, final String redirectFlowId,
        final Boolean isCompleted) {
        if (isCompleted) {
            Job job = jobRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(JOB_NOT_FOUND));
            if (!job.getJobStatus().equals(JobStatus.NEW)) {
                throw new BadRequest400Exception(NOT_SUPPORTED_JOB_STATUS);
            }
            User user = userProfileRepository.findById(profileId).orElseThrow(() -> new NotFound404Exception(PROFILE_NOT_FOUND)).getUsers();
            if (!jobApplicantRepository.findByJobAndApplicant(job, user).isPresent()) {
                throw new BadRequest400Exception(USER_NOT_APPLIED);
            }
            if (offerRepository.findByJobAndShooter(job, user).isPresent()) {
                throw new BadRequest400Exception(OFFER_ALREADY_SENT);
            }
            final String mandateId = paymentService.completeGoCardlessRedirectFlow(redirectFlowId);
            Offer offer = Offer.createOfferWithGoCardless(job, user, mandateId);
            offer.setGoCardlessMandateId(mandateId);
            offerRepository.save(offer);
            jobService.changeJobStatus(job, JobStatus.WAITING_FOR_RESPONSE);
            emailService.sendJobOfferSentEmail(user, job);
            notificationService.sendJobOfferNotification(jobId, user);
            LOGGER.info("Offer for job with id: {} successfully created and sent to user: {}", jobId, user.getEmail());
            return RestMessageDTO.createSuccessRestMessageDTO("Offer successfully sent");
        }
        return RestMessageDTO.createFailureRestMessageDTO("Redirect flow was not completed, offer wasn't send");
    }

    @Override
    public void changeOfferPaymentStatus(Offer offer, PaymentStatus paymentStatus) {
        offer.setPaymentStatus(paymentStatus);
        offerRepository.save(offer);
    }

}