package com.sombrainc.repository;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.Offer;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OfferRepository extends JpaRepository<Offer, Long> {

    Optional<Offer> findByJobAndShooter(Job job, User user);

    Optional<Offer> findByJobAndShooterAndAcceptedIsNull(Job job, User user);

    Optional<Offer> findByJobAndShooterAndAcceptedIsFalse(Job job, User user);

    List<Offer> findAllByAcceptedIsNullAndDateBefore(LocalDateTime dateTime);

    List<Offer> findByShooter(User user);

    Optional<Offer> findByJobAndAcceptedIsNull(Job job);

    @Query("select o.shooter from Offer o where o.job = :job and o.accepted = false")
    List<User> findUsersWithDeclinedOffers(@Param("job") Job job);

    List<Offer> findByJobIn(List<Job> jobs);

    List<Offer> findByGoCardlessMandateId(final String mandateId);

    Optional<Offer> findByGoCardlessFirstPaymentIdAndGoCardlessSecondPaymentIdIsNull(final String paymentId);

    Optional<Offer> findByGoCardlessSecondPaymentIdAndGoCardlessFirstPaymentIdIsNotNull(final String paymentId);

    List<Offer> findByPaymentStatus(final PaymentStatus paymentStatus);
}
