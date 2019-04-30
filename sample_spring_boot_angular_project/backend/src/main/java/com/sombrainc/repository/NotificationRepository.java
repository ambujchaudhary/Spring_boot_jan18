package com.sombrainc.repository;

import com.sombrainc.entity.Notification;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.NotificationType;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long>, JpaSpecificationExecutor<Notification> {

    List<Notification> findAllByHiddenFalseAndReceiver_Email(String email);

    List<Notification> findAllByReceiver_Email(String email, Pageable pageable);

    @Query(
        "SELECT n FROM Notification n WHERE n.receiver = :owner AND n.eventDate >= :start AND n.eventDate < :to AND n.notificationType = :notificationType")
    List<Notification> findOnceADayNotification(@Param("owner") User owner, @Param("start") LocalDateTime from, @Param("to") LocalDateTime to,
        @Param("notificationType") NotificationType notificationType);
}
