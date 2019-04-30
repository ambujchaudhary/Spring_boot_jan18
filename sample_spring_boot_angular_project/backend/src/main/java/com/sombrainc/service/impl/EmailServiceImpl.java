package com.sombrainc.service.impl;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.Offer;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.entity.enumeration.Role;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.EmailSenderService;
import com.sombrainc.service.EmailService;
import com.sombrainc.util.EmailGenerator;
import com.sombrainc.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.format.DateTimeFormatter;

import static com.sombrainc.util.EmailUtil.*;

@Slf4j
@Service
public class EmailServiceImpl implements EmailService {

    @Value("${mail.base.url}")
    private String rootPath;

    @Value("${mail.change-password.template}")
    private String changePasswordLocation;

    @Value("${mail.notification-to-admin.template}")
    private String notificationMailToAdmin;

    @Value("${mail.profile-verification-success-notification-to-user.template}")
    private String profileVerificationSuccessNotificationToUser;

    @Value("${mail.profile-verification-failed-notification-to-user.template}")
    private String profileVerificationFailedNotificationToUser;

    @Value("${mail.job-offer-sent.template}")
    private String jobOfferSent;

    @Value("${mail.job-offer-accepted.template}")
    private String jobOfferAccepted;

    @Value("${mail.job-offer-payed-out.template}")
    private String jobOfferPayedOut;

    @Value("${mail.job-offer-declined.template}")
    private String jobOfferDeclined;

    @Value("${mail.job-offer-expired.template}")
    private String jobOfferExpired;

    @Value("${mail.complete-job.template}")
    private String completeJobNotification;

    @Value("${mail.job-expiring.template}")
    private String jobExpiring;

    @Value("${mail.job-alert.template}")
    private String jobAlert;

    @Value("${mail.refund-request.template}")
    private String refundRequest;

    @Value("${mail.newMessage.template}")
    private String newMessageEmail;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void sendConfirmForgotPasswordEmail(final User user, final String link) {
        LOGGER.info("Sending email with temporal link to confirm forgotten password for user: {}", user);
        String url = String.format(CHANGE_PASS_MAIL_URL, this.rootPath, link);
        String mail = EmailGenerator.generateMailWithUsername(user.getFirstName(), url, rootPath, changePasswordLocation,
            RESET_PASS_BUTTON);
        emailSenderService.sendMail(user.getEmail(), RESET_SUBJECT, mail);
        LOGGER.info("Email to confirm forgotten password successfully sent to user: {}", user.getEmail());
    }

    @Override
    public void sendNotificationEmailToAdmin() {
        String url = String.format(NOTIFICATION_MAIL_URL, this.rootPath);
        String mail = EmailGenerator.generateNotificationToAdmin(url, rootPath, notificationMailToAdmin, OPEN_ADMIN_BUTTON);
        userRepository
            .findEmailsByUserRole(Role.ROLE_ADMIN)
            .forEach(email -> emailSenderService.sendMail(email, PENDING_USER_SUBJECT, mail));
    }

    @Override
    public void sendRefundEmailToAdmin(String paymentId, String mandateId, BigDecimal amount) {
        String mail = EmailGenerator.generateRefundEmailToAdmin(refundRequest, paymentId, mandateId, amount.toString());
        userRepository
            .findEmailsByUserRole(Role.ROLE_ADMIN)
            .forEach(email -> emailSenderService.sendMail(email, REFUND_REQUEST, mail));
    }

    @Override
    public void sendVerificationSuccessEmail(final User user) {
        LOGGER.info("Sending email notification to user: {} about approved user profile", user);
        String url = String.format(USER_DASHBOARD_MAIL_URL, this.rootPath);
        String mail = EmailGenerator.generateMailWithUsername(user.getFirstName(), url, rootPath,
            profileVerificationSuccessNotificationToUser, OPEN_ACCOUNT_BUTTON);
        emailSenderService.sendMail(user.getEmail(), VERIFICATION_SUCCESS, mail);
        LOGGER.info("Email with notification about accept user profile successfully sent to user: {}", user.getEmail());
    }

    @Override
    public void sendVerificationFailedEmail(final User user) {
        LOGGER.info("Sending email notification to user: {} about declined user profile", user);
        String url = String.format(USER_PROFILE_MAIL_URL, this.rootPath);
        String mail = EmailGenerator.generateMailWithUsername(user.getFirstName(), url, rootPath,
            profileVerificationFailedNotificationToUser, OPEN_ACCOUNT_BUTTON);
        emailSenderService.sendMail(user.getEmail(), MORE_INFO_REQUIRED_SUBJECT, mail);
        LOGGER.info("Email with notification about declined user profile successfully sent to user: {}", user.getEmail());
    }

    @Override
    public void sendJobOfferSentEmail(final User user, final Job job) {
        String url = String.format(FIND_JOB_URL, this.rootPath, job.getId());
        String mail = EmailGenerator.generateMailWithUsername(user.getFirstName(), url, rootPath, jobOfferSent, VIEW_APPLICATION_BUTTON);
        emailSenderService.sendMail(user.getEmail(), NEW_JOB_OFFER_SUBJECT, mail);
        LOGGER.info("Email notification about job offer sent successfully sent to user: {}", user.getEmail());
    }

    @Override
    public void sendJobOfferAcceptedEmail(final User user, final Job job) {
        String fullName = UserUtil.getFullName(job.getShooter());
        String url = String.format(FIND_JOB_URL, this.rootPath, job.getId());
        String mail = EmailGenerator.generateMailWithUsername(fullName, url, rootPath, jobOfferAccepted, OPEN_ACTIVE_BUTTON);
        emailSenderService.sendMail(job.getOwner().getEmail(), OFFER_ACCEPTED_SUBJECT, mail);
        LOGGER.info("Email notification about job offer accepted successfully sent to user: {}", user.getEmail());
    }

    @Override
    public void sendJobOfferPayedOutEmail(final User user, final Offer offer) {
        String fullName = UserUtil.getFullName(offer.getShooter());
        String url = String.format(FIND_JOB_URL, this.rootPath, offer.getJob().getId());
        String mail = EmailGenerator.generateMailWithUsername(fullName, url, rootPath, jobOfferPayedOut, "GO TO ACTIVE JOB");
        emailSenderService.sendMail(user.getEmail(), OFFER_PAYED_OUT, mail);
        LOGGER.info("Email notification about job offer was payed out successfully sent to user: {}", user.getEmail());
    }

    @Override
    public void sendJobOfferDeclinedEmail(final Offer offer) {
        String shooterName = UserUtil.getFullName(offer.getShooter());
        String url = String.format(FIND_JOB_URL, this.rootPath, offer.getJob().getId());
        String mail = EmailGenerator.generateMailWithJobTitleAndShooter(shooterName, offer.getJob().getTitle(), url, rootPath,
            jobOfferDeclined, VIEW_APPLICATION_BUTTON);
        emailSenderService.sendMail(offer.getJob().getOwner().getEmail(), OFFER_DECLINED_SUBJECT, mail);
        LOGGER.info("Email notification about job offer declined successfully sent to user: {}", offer.getJob().getOwner().getEmail());
    }

    @Override
    public void sendJobOfferExpiredEmail(final Offer offer) {
        String shooterName = UserUtil.getFullName(offer.getShooter());
        String url = String.format(FIND_JOB_URL, this.rootPath, offer.getJob().getId());
        String mail = EmailGenerator.generateMailWithJobTitleAndShooter(shooterName, offer.getJob().getTitle(), url, rootPath,
            jobOfferExpired, VIEW_APPLICATION_BUTTON);
        emailSenderService.sendMail(offer.getShooter().getEmail(), OFFER_EXPIRED_SUBJECT, mail);
        LOGGER.info("Email notification about job offer expired successfully sent to user: {}", offer.getJob().getOwner().getEmail());
    }

    @Override
    public void sendCompleteJobEmail(final Job job) {
        String url = String.format(FIND_JOB_URL, this.rootPath, job.getId());
        User owner = job.getOwner();
        String ownerName;
        if (job.getOwnerType().equals(JobOwner.PERSONAL_NAME)) {
            ownerName = UserUtil.concatStrings(owner.getFirstName(), owner.getLastName());
        } else {
            ownerName = owner.getBusinessProfile().getBusinessName();
        }
        User shooter = job.getShooter();
        String shooterName = UserUtil.concatStrings(shooter.getFirstName(), shooter.getLastName());
        String mail = EmailGenerator.generateMailWithJobTitleAndOwnerAndShooter(job.getTitle(), ownerName, shooterName, url, rootPath,
            completeJobNotification, VIEW_APPLICATION_BUTTON);
        emailSenderService.sendMail(owner.getEmail(), CREW_REVIEW_SUBJECT, mail);
        LOGGER.info("Email notification about job complete successfully sent to user: {}", owner.getEmail());
    }

    @Override
    public void sendJobExpiring(final Job job) {
        String url = String.format(FIND_JOB_URL, this.rootPath, job.getId());
        String mail = EmailGenerator.generateMailWithJobTitle(job.getTitle(), url, rootPath, jobExpiring, VIEW_APPLICATION_BUTTON);
        emailSenderService.sendMail(job.getOwner().getEmail(), JOB_EXPIRING_SUBJECT, mail);
        LOGGER.info("Email notification about job expiring successfully sent to user: {}", job.getOwner().getEmail());
    }

    @Override
    public void sendJobAlertEmail(Job job, String userEmail) {
        String url = String.format(FIND_JOB_URL, this.rootPath, job.getId());
        String jobTypes = WorkerRole.jobTypesOf(job.getWorkerRoles()).toString();
        String jobDate = job.getDate().format(DateTimeFormatter.ofPattern(DATE_TIME_FORMAT)).toUpperCase();
        String mail = EmailGenerator.generateMailWithJobDateTypeAndTitle(jobDate, jobTypes.substring(1, jobTypes.length() - 1),
            job.getTitle(), url, rootPath, jobAlert, MORE_INFO_BUTTON);
        emailSenderService.sendMail(userEmail, JOB_ALERT_SUBJECT, mail);
        LOGGER.info("Job alert email notification about successfully sent to user: {}", userEmail);
    }

    @Override
    public void sendNewMessageEmail(String userEmail) {
        String mail = EmailGenerator.generateNewMessageMail(newMessageEmail);
        emailSenderService.sendMail(userEmail, NEW_MESSAGE_SUBJECT, mail);
        LOGGER.info("Job alert email notification about successfully sent to user: {}", userEmail);
    }

}
