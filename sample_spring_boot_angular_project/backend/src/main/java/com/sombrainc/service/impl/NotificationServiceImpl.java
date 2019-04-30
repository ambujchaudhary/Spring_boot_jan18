package com.sombrainc.service.impl;

import com.sombrainc.dto.NotificationDTO;
import com.sombrainc.entity.Notification;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.entity.enumeration.NotificationType;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.JobRepository;
import com.sombrainc.repository.NotificationRepository;
import com.sombrainc.service.FirebaseService;
import com.sombrainc.service.NotificationService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.NotificationDTOMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class NotificationServiceImpl implements NotificationService {

    private static final String EVERY_DAY_AT_12AM = "0 0 0 * * ?";

    private static final int SHOOTER_NOT_COMPLETED_PERIOD = 2;

    private static final int BUSINESS_NOT_COMPLETED_PERIOD = 5;

    private static final int SHOOTER_BEFORE_JOB_NOTIFY_PERIOD = 3;

    private static final String LINK_PATTERN = "\\[\\[.*?]]";

    private static final String NOTIFICATION_DESTINATION = "/queue/notify";

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private SimpMessagingTemplate template;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private FirebaseService firebaseService;

    private void sendNotification(String userEmail, NotificationDTO notificationDTO) {
        LOGGER.info("Sent to: " + userEmail + " " + NOTIFICATION_DESTINATION + " " + notificationDTO.toString());
        template.convertAndSendToUser(userEmail, NOTIFICATION_DESTINATION, notificationDTO);
    }

    private void saveAndSendNotification(Notification notification, String email) {
        notificationRepository.save(notification);
        sendNotification(email, NotificationDTOMapper.INSTANCE.map(notification));
        firebaseService.sendNotification(notification.getTitle(), removeLink(notification.getMessage()), notification.getReceiver().getId(),
            notification.getLink());
    }

    private List<NotificationDTO> getUnreadNotificationsForCurrentUser() {
        String email = userService.getCurrentUserEmail();
        return notificationRepository
            .findAllByHiddenFalseAndReceiver_Email(email)
            .stream()
            .map(NotificationDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
    }

    @Override
    public void sendUnreadNotifications() {
        getUnreadNotificationsForCurrentUser().forEach(notification -> sendNotification(notification.getReceiver(), notification));
    }

    @Override
    public List<NotificationDTO> getAllNotificationsForCurrentUser(Pageable pageable) {
        String email = userService.getCurrentUserEmail();
        return notificationRepository
            .findAllByReceiver_Email(email, pageable)
            .stream()
            .map(NotificationDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
    }

    private NotificationDTO markAsRead(Long id) {
        Notification notification = notificationRepository
            .findById(id)
            .orElseThrow(() -> new NotFound404Exception("Notification not found"));
        notification.setHidden(TRUE);
        notificationRepository.save(notification);
        return NotificationDTOMapper.INSTANCE.map(notification);
    }

    @Override
    public void markAsReadAndNotify(Long id) {
        NotificationDTO notificationDTO = markAsRead(id);
        sendNotification(notificationDTO.getReceiver(), notificationDTO);
    }

    @Override
    public void markAllAsReadAndNotify() {
        String email = userService.getCurrentUserEmail();
        notificationRepository
            .findAllByHiddenFalseAndReceiver_Email(email)
            .forEach(notification -> markAsReadAndNotify(notification.getId()));
    }

    @Override
    public void sendJobOfferNotification(Long jobId, User user) {
        NotificationType notificationType = NotificationType.OFFER_SENT;
        Notification notification = Notification
            .createDefault(notificationType, user)
            .message(String.format(notificationType.getBody(), jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, user.getEmail());
    }

    @Override
    public void sendProfileApprovedNotification(User user) {
        Notification notification = Notification.createDefault(NotificationType.PROFILE_APPROVED, user).build();
        saveAndSendNotification(notification, user.getEmail());
    }

    @Override
    public void sendProfileDeclinedNotification(User user) {
        Notification notification = Notification.createDefault(NotificationType.PROFILE_DECLINED, user).build();
        saveAndSendNotification(notification, user.getEmail());
    }

    @Override
    public void sendOfferAcceptedNotification(User owner, String jobTitle, String shooterName, Long jobId) {
        NotificationType notificationType = NotificationType.OFFER_ACCEPTED;
        Notification notification = Notification
            .createDefault(notificationType, owner)
            .message(String.format(notificationType.getBody(), shooterName, jobTitle, jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, owner.getEmail());
    }

    @Override
    public void sendOfferPayedOutNotification(User owner, String jobTitle, String shooterName, Long jobId) {
        NotificationType notificationType = NotificationType.OFFER_PAYED_OUT;
        Notification notification = Notification
            .createDefault(notificationType, owner)
            .message(String.format(notificationType.getBody(), shooterName, jobTitle, jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, owner.getEmail());
    }

    @Override
    public void sendGoCardlessDirectDebitFailedSetup(User owner, String jobTitle, Long jobId) {
        NotificationType notificationType = NotificationType.DIRECT_DEBIT_FAILED;
        Notification notification = Notification
            .createDefault(notificationType, owner)
            .message(String.format(notificationType.getBody(), jobTitle, jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, owner.getEmail());
    }

    @Override
    public void sendGoCardlessPaymentFailed(User owner, String jobTitle, Long jobId) {
        NotificationType notificationType = NotificationType.PAYMENT_FAILED;
        Notification notification = Notification
            .createDefault(notificationType, owner)
            .message(String.format(notificationType.getBody(), jobTitle))
            .build();
        saveAndSendNotification(notification, owner.getEmail());
    }

    @Override
    public void sendGoCardlessRetryPaymentFailed(User owner, String jobTitle, Long jobId) {
        NotificationType notificationType = NotificationType.RETRY_PAYMENT_FAILED;
        Notification notification = Notification
            .createDefault(notificationType, owner)
            .message(String.format(notificationType.getBody(), jobTitle, jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, owner.getEmail());
    }

    @Override
    public void sendOfferDeclinedNotification(User owner, String jobTitle, String shooterName, Long jobId) {
        NotificationType notificationType = NotificationType.OFFER_DECLINED;
        Notification notification = Notification
            .createDefault(notificationType, owner)
            .message(String.format(notificationType.getBody(), shooterName, jobTitle, jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, owner.getEmail());
    }

    @Override
    public void sendJobEditNotification(Long jobId, User applicant) {
        NotificationType notificationType = NotificationType.JOB_EDITED;
        Notification notification = Notification
            .createDefault(notificationType, applicant)
            .message(String.format(notificationType.getBody(), jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, applicant.getEmail());
    }

    @Override
    public void sendNewApplicantsNotification(Long jobId, String jobTitle, User owner) {
        NotificationType notificationType = NotificationType.NEW_APPLICANTS;
        LocalDateTime from = LocalDate.now().atStartOfDay();
        LocalDateTime to = LocalDate.now().atStartOfDay().plusDays(1);
        List<Notification> notifications = notificationRepository.findOnceADayNotification(owner, from, to,
            NotificationType.NEW_APPLICANTS);
        if (notifications.isEmpty()) {
            Notification notification = Notification
                .createDefault(notificationType, owner)
                .message(String.format(notificationType.getBody(), jobTitle, jobId))
                .link(String.format(notificationType.getUrl(), jobId))
                .build();
            saveAndSendNotification(notification, owner.getEmail());
        }
    }

    @Override
    public void sendUpcomingJobNotification(User shooter, Long jobId) {
        NotificationType notificationType = NotificationType.UPCOMING_JOB;
        if (shooter != null) {
            Notification notification = Notification
                .createDefault(notificationType, shooter)
                .message(String.format(notificationType.getBody(), jobId))
                .link(String.format(notificationType.getUrl(), jobId))
                .build();
            saveAndSendNotification(notification, shooter.getEmail());
        }
    }

    @Override
    public void sendApplicationUpdateNotification(User applicant, String jobTitle) {
        NotificationType notificationType = NotificationType.APPLICATION_UPDATE;
        Notification notification = Notification.createDefault(notificationType, applicant)
                                                .message(String.format(notificationType.getBody(), jobTitle))
                                                .build();
        saveAndSendNotification(notification, applicant.getEmail());
    }

    @Override
    public void sendNewJobInRadiusNotification(User user, Long jobId) {
        NotificationType notificationType = NotificationType.NEW_JOB_IN_RADIUS;
        Notification notification = Notification
            .createDefault(notificationType, user)
            .message(String.format(notificationType.getBody(), jobId))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, user.getEmail());
    }

    private void sendTodayJobNotification(User shooter) {
        if (shooter != null) {
            Notification notification = Notification.createDefault(NotificationType.TODAY_JOB, shooter).build();
            saveAndSendNotification(notification, shooter.getEmail());
        }
    }

    private void sendShooterNotCompletedJobNotification(User shooter, String businessName) {
        NotificationType notificationType = NotificationType.SHOOTER_NOT_COMPLETED;
        if (shooter != null) {
            Notification notification = Notification
                .createDefault(notificationType, shooter)
                .message(String.format(notificationType.getBody(), businessName))
                .build();
            saveAndSendNotification(notification, shooter.getEmail());
        }
    }

    private void sendBusinessNotCompletedJobNotification(User owner, String jobTitle, Long jobId) {
        NotificationType notificationType = NotificationType.BUSINESS_NOT_COMPLETED;
        Notification notification = Notification
            .createDefault(notificationType, owner)
            .message(String.format(notificationType.getBody(), jobId, jobTitle))
            .link(String.format(notificationType.getUrl(), jobId))
            .build();
        saveAndSendNotification(notification, owner.getEmail());
    }

    private void before3DayNotification() {
        jobRepository
            .findByDateIs(LocalDate.now().plusDays(SHOOTER_BEFORE_JOB_NOTIFY_PERIOD))
            .forEach(job -> sendUpcomingJobNotification(job.getShooter(), job.getId()));
    }

    private void currentDayNotification() {
        jobRepository.findByDateIs(LocalDate.now()).forEach(job -> sendTodayJobNotification(job.getShooter()));
    }

    private void shooterNotCompletedNotification() {
        jobRepository
            .findByDateAndJobStatus(LocalDate.now().minusDays(SHOOTER_NOT_COMPLETED_PERIOD), JobStatus.IN_PROGRESS)
            .forEach(
                job -> sendShooterNotCompletedJobNotification(job.getShooter(), job.getOwner().getBusinessProfile().getBusinessName()));
    }

    private void businessNotCompletedNotification() {
        jobRepository
            .findByDateAndJobStatus(LocalDate.now().minusDays(BUSINESS_NOT_COMPLETED_PERIOD), JobStatus.IN_PROGRESS)
            .forEach(job -> sendBusinessNotCompletedJobNotification(job.getOwner(), job.getTitle(), job.getId()));
    }

    @Scheduled(cron = EVERY_DAY_AT_12AM)
    public void sendScheduledNotifications() {
        before3DayNotification();
        currentDayNotification();
        shooterNotCompletedNotification();
        businessNotCompletedNotification();
    }

    private static String removeLink(String input) {
        return input.replaceAll(LINK_PATTERN, StringUtils.EMPTY);
    }
}
