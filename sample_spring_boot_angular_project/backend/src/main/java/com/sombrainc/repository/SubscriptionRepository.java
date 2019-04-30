package com.sombrainc.repository;

import com.sombrainc.entity.Subscription;
import com.sombrainc.entity.enumeration.SubscriptionStatus;
import com.sombrainc.entity.enumeration.SubscriptionType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {

    Optional<Subscription> findBySubscriptionId(String subscriptionId);

    List<Subscription> findBySubscriptionFailedIsNotNull();

    List<Subscription> findByStatus(SubscriptionStatus status);

    Optional<Subscription> findByStatusAndUsers_Email(SubscriptionStatus status, String email);

    @Query("SELECT s FROM Subscription s INNER JOIN s.users u WHERE s.status <> 'CANCELLED' AND u.email = :email")
    List<Subscription> findNotCancelledSubscriptions(@Param("email") String email);

    Optional<Subscription> findByStatusAndTypeAndUsers_Email(SubscriptionStatus status, SubscriptionType type, String email);

    @Query("SELECT s FROM Subscription s LEFT JOIN s.users u WHERE s.status = :status AND s.type = :subType AND u.email = :email")
    Optional<Subscription> findByStatusAndTypeForUser(@Param("status") SubscriptionStatus subscriptionStatus,
        @Param("subType") SubscriptionType type, @Param("email") String email);

    @Query("SELECT s FROM Subscription s LEFT JOIN s.users u WHERE (s.status = 'NON_RENEWING' OR s.status = 'ACTIVE') "
        + "AND s.type = :subType AND u.email = :email")
    Optional<Subscription> findActiveAndNonRenewingByTypeForUser(@Param("subType") SubscriptionType type, @Param("email") String email);

    @Query("SELECT s FROM Subscription s INNER JOIN s.users u INNER JOIN FreeTier ft ON ft.user = s.users "
        + "WHERE u.email = :email AND s.status = 'ACTIVE' AND s.type = 'FREE' AND ft.applications = 0")
    Optional<Subscription> findApplicationLimit(@Param("email") String email);
}
