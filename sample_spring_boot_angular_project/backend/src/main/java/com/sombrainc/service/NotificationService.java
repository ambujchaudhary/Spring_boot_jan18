package com.sombrainc.service;

import com.sombrainc.dto.NotificationDTO;
import com.sombrainc.entity.User;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {

    void sendUnreadNotifications();

    List<NotificationDTO> getAllNotificationsForCurrentUser(Pageable pageable);

    void markAsReadAndNotify(Long id);

    void markAllAsReadAndNotify();

    void sendJobOfferNotification(Long jobId, User user);

    void sendProfileApprovedNotification(User user);

    void sendProfileDeclinedNotification(User user);

    void sendOfferAcceptedNotification(User owner, String jobTitle, String shooterName, Long jobId);

    void sendOfferDeclinedNotification(User owner, String jobTitle, String shooterName, Long jobId);

    void sendJobEditNotification(Long jobId, User applicant);

    void sendNewApplicantsNotification(Long jobId, String jobTitle, User owner);

    void sendUpcomingJobNotification(User shooter, Long jobId);

    void sendApplicationUpdateNotification(User applicant, String jobTitle);

    void sendNewJobInRadiusNotification(User user, Long jobId);

    void sendOfferPayedOutNotification(User owner, String jobTitle, String shooterName, Long jobId);

    void sendGoCardlessDirectDebitFailedSetup(User owner, String jobTitle, Long jobId);

    void sendGoCardlessPaymentFailed(User owner, String jobTitle, Long jobId);

    void sendGoCardlessRetryPaymentFailed(User owner, String jobTitle, Long jobId);
}
