package com.sombrainc.util;

import com.sombrainc.entity.Job;
import com.sombrainc.entity.User;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class PaymentUtil {

    public static final String STRIPE_CHARGE_FAILED = "Stripe charge failed for user: {}";

    public static final String SUCCESS_STATUS = "succeeded";

    public static final String AMOUNT = "amount";

    public static final String CURRENCY = "currency";

    public static final String SOURCE = "source";

    public static final String CHARGE = "charge";

    public static final String RECEIPT_EMAIL = "receipt_email";

    public static final String EMAIL = "email";

    public static final String CAPTURE_FAILED = "Capture charge failed";

    public static final String PAYMENT_FAILED = "Payment failed";

    public static final String STRIPE_CUSTOMER_FAILED = "Stripe customer create failed";

    public static final String REFUND_FAILED = "Refund failed";

    public static final String DESCRIPTION_TITLE = "description";

    public static final String CUSTOMER = "customer";

    public static final String FAILED = "failed";

    public static final String SUBMITTED = "submitted";

    public static final String GO_CARDLESS_REFUND_RETURNED = "funds_returned";

    public static final String CONFIRMED = "confirmed";

    public static final String ACTIVE = "active";

    public static final String CREATED = "created";

    public static final String SHOOTZU = "Shootzu";

    public static final String CANCELLED = "cancelled";

    public static final String EVERY_DAY_AT_2_AM = "0 0 02 * * *";

    public static final String REDIRECT_FLOW_FAILED = "Creating GoCardless redirect flow failed";

    public static final String GO_CARDLESS_PAYMENT_FAILED = "Creating GoCardless payment failed";

    public static final String GO_CARDLESS_PAYMENT_RETRY_FAILED = "Retrying of the GoCardless payment failed";

    public static final String COMPLETE_REDIRECT_FLOW_FAILED = "Completing of the GoCardless redirect flow failed";

    private static final BigDecimal STRIPE_PERCENT_COMMISSION = BigDecimal.valueOf(0.029);

    private static final BigDecimal STRIPE_FIXED_COMMISSION = BigDecimal.valueOf(0.3);

    private static final BigDecimal GO_CARDLESS_MIN_COMMISSION = BigDecimal.valueOf(0.35);

    private static final BigDecimal GO_CARDLESS_MAX_COMMISSION = BigDecimal.valueOf(3.5);

    private static final BigDecimal GO_CARDLESS_FIXED_COMMISSION = BigDecimal.valueOf(0.01);

    private static final String DESCRIPTION = "Business name: %s,\nBusiness Email address: %s,\nJob id: %s,\nDate of Job: %s,\nCrew name: %s,\nCrew email: %s";

    private PaymentUtil() {
    }

    public static String createPaymentDescription(User business, Job job, User shooter) {
        return String.format(DESCRIPTION, business.getBusinessProfile().getBusinessName(), business.getEmail(), job.getId(), job.getDate(),
            shooter.getFirstName() + " " + shooter.getLastName(), shooter.getEmail());
    }

    public static String getAmount(Job job) {
        return job.getPricePerHour().multiply(job.getNumberOfHours()).setScale(2, RoundingMode.HALF_EVEN).toString();
    }

    /**
     * To calculate needed amount use next formula:
     * Payment to charge = (Payment needed + Fixed commission(30c))/(1 - Percent commission(2.9%))
     *
     * @return half amount with commission 2.9% + 30c
     */
    public static int calculateHalfOfStripeAmount(BigDecimal pricePerHour, BigDecimal numberOfHours) {
        BigDecimal fullAmount = pricePerHour.multiply(numberOfHours).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal goal = fullAmount.divide(BigDecimal.valueOf(2), RoundingMode.HALF_EVEN);
        BigDecimal goalPlusFixed = goal.add(STRIPE_FIXED_COMMISSION);
        BigDecimal denominator = BigDecimal.ONE.subtract(STRIPE_PERCENT_COMMISSION);
        BigDecimal result = goalPlusFixed.divide(denominator, RoundingMode.HALF_EVEN);
        return result.movePointRight(2).intValue();
    }

    /**
     * To calculate needed amount use next formula:
     * Payment to charge = (Payment needed + Fixed commission(30c))/(1 - Percent commission(2.9%))
     *
     * @return full amount with commission 2.9% + 30c
     */
    public static int calculateFullStripeAmount(BigDecimal pricePerHour, BigDecimal numberOfHours) {
        BigDecimal goal = pricePerHour.multiply(numberOfHours).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal goalPlusFixed = goal.add(STRIPE_FIXED_COMMISSION);
        BigDecimal denominator = BigDecimal.ONE.subtract(STRIPE_PERCENT_COMMISSION);
        BigDecimal result = goalPlusFixed.divide(denominator, RoundingMode.HALF_EVEN);
        return result.movePointRight(2).intValue();
    }

    /**
     * Calculation is valid only for Australia.
     * GoCardless standard commission is 1%, Min 35c, capped at $3.50 in AUD
     *
     * @return half amount with commission
     */
    public static int calculateHalfOfGoCardlessAmount(BigDecimal pricePerHour, BigDecimal numberOfHours) {
        BigDecimal fullAmount = pricePerHour.multiply(numberOfHours).setScale(2, RoundingMode.HALF_EVEN);
        BigDecimal halfAmount = fullAmount.divide(BigDecimal.valueOf(2), RoundingMode.HALF_EVEN);
        BigDecimal commission = halfAmount.multiply(GO_CARDLESS_FIXED_COMMISSION);
        if (commission.compareTo(GO_CARDLESS_MIN_COMMISSION) < 0) {
            commission = GO_CARDLESS_MIN_COMMISSION;
        } else if (commission.compareTo(GO_CARDLESS_MAX_COMMISSION) > 0) {
            commission = GO_CARDLESS_MAX_COMMISSION;
        }
        return halfAmount.add(commission).movePointRight(2).intValue();
    }
}
