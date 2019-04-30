package com.sombrainc.entity;

import com.sombrainc.entity.enumeration.PaymentStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDateTime;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
@Entity
@EntityListeners(AuditingEntityListener.class)
@Table(name = "offer")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "job")
    private Job job;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "shooter")
    private User shooter;

    @Column(name = "date")
    @CreatedDate
    private LocalDateTime date;

    @Column(name = "accepted")
    private Boolean accepted;

    @Column(name = "first_stripe_charge_id")
    private String firstStripeChargeId;

    @Column(name = "go_cardless_first_payment_id")
    private String goCardlessFirstPaymentId;

    @Column(name = "go_cardless_mandate_id")
    private String goCardlessMandateId;

    @Column(name = "stripe_customer_id")
    private String stripeCustomerId;

    @Column(name = "go_cardless_second_payment_id")
    private String goCardlessSecondPaymentId;

    @Column(name = "second_stripe_charge_id")
    private String secondStripeChargeId;

    @Enumerated(EnumType.STRING)
    @Column(name = "payment_status")
    private PaymentStatus paymentStatus;

    @Column(name = "full_amount_charge")
    private Boolean fullAmountCharge;

    private Offer(Job job, User shooter, String stripeCustomerId, String firstStripeChargeId, boolean fullAmountCharge) {
        this.job = job;
        this.shooter = shooter;
        this.firstStripeChargeId = firstStripeChargeId;
        this.stripeCustomerId = stripeCustomerId;
        this.fullAmountCharge = fullAmountCharge;
    }

    private Offer(Job job, User shooter, String mandateId) {
        this.job = job;
        this.shooter = shooter;
        this.goCardlessMandateId = mandateId;
        this.fullAmountCharge = false;
    }

    public static Offer createOfferWithStripe(Job job, User user, String stripeCustomerId, String firstStripeChargeId,
        boolean fullAmountCharge) {
        return new Offer(job, user, stripeCustomerId, firstStripeChargeId, fullAmountCharge);
    }

    public static Offer createOfferWithGoCardless(Job job, User user, String mandateId) {
        return new Offer(job, user, mandateId);
    }

}
