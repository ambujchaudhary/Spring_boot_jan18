package com.sombrainc.service.impl;

import com.gocardless.GoCardlessClient;
import com.gocardless.GoCardlessException;
import com.gocardless.Webhook;
import com.gocardless.errors.InvalidSignatureException;
import com.gocardless.resources.Event;
import com.gocardless.resources.RedirectFlow;
import com.gocardless.services.RedirectFlowService;
import com.sombrainc.entity.*;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.entity.enumeration.PaymentStatus;
import com.sombrainc.exception.Forbidden403Exception;
import com.sombrainc.repository.FeedbackRepository;
import com.sombrainc.repository.GoCardlessWebhooksRepository;
import com.sombrainc.repository.OfferRepository;
import com.sombrainc.service.*;
import com.sombrainc.util.PaymentUtil;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import com.stripe.model.Refund;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.RandomStringUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

import static com.gocardless.GoCardlessClient.Environment;
import static com.gocardless.GoCardlessClient.newBuilder;
import static com.sombrainc.util.PaymentUtil.*;

@Slf4j
@Service
public class PaymentServiceImpl implements PaymentService, InitializingBean {

    @Value("${gocardless.webhook.secret}")
    private String webhookSecretKey;

    @Value("${stripe.api.key}")
    private String stripeKey;

    @Value("${gocardless.api.key}")
    private String goCardlessApiKey;

    @Autowired
    private UserService userService;

    @Autowired
    private OfferService offerService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private OfferRepository offerRepository;

    @Autowired
    private JobService jobService;

    @Autowired
    private GoCardlessWebhooksRepository goCardlessWebhooksRepository;

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private EmailService emailService;

    @Override
    public void afterPropertiesSet() throws Exception {
        Stripe.apiKey = stripeKey;
    }

    @Override
    public String createStripeCharge(final BigDecimal pricePerHour, final BigDecimal numberOfHours, final String description,
        final String customerId, final boolean fullAmountCharge, final String ownerEmail) {
        int stripeAmount;
        if (fullAmountCharge) {
            stripeAmount = PaymentUtil.calculateFullStripeAmount(pricePerHour, numberOfHours);
        } else {
            stripeAmount = PaymentUtil.calculateHalfOfStripeAmount(pricePerHour, numberOfHours);
        }
        Map<String, Object> params = new HashMap<>();
        params.put(AMOUNT, stripeAmount);
        params.put(CURRENCY, "aud");
        params.put(CUSTOMER, customerId);
        params.put(RECEIPT_EMAIL, ownerEmail);
        params.put(DESCRIPTION_TITLE, description);
        try {
            Charge charge = Charge.create(params);
            if (!SUCCESS_STATUS.equals(charge.getStatus())) {
                LOGGER.error(STRIPE_CHARGE_FAILED, ownerEmail);
                throw new Forbidden403Exception(PAYMENT_FAILED);
            }
            LOGGER.info("Charge({}) successfully created for the user: {}", stripeAmount, ownerEmail);
            return charge.getId();
        } catch (StripeException e) {
            LOGGER.error(PAYMENT_FAILED, e);
            throw new Forbidden403Exception(PAYMENT_FAILED);
        }
    }

    @Override
    public String createStripeCustomer(final String token) {
        String userEmail = userService.getCurrentUserEmail();
        Map<String, Object> params = new HashMap<>();
        params.put(SOURCE, token);
        params.put(EMAIL, userEmail);
        try {
            Customer customer = Customer.create(params);
            LOGGER.info("Customer successfully created for the user: {}", userEmail);
            return customer.getId();
        } catch (StripeException e) {
            LOGGER.error(STRIPE_CUSTOMER_FAILED, e);
            throw new Forbidden403Exception(STRIPE_CUSTOMER_FAILED);
        }
    }

    @Override
    public void createRefund(String chargeId) {
        LOGGER.info("Creating refund for charge id: {}", chargeId);
        Map<String, Object> refundParams = Map.of(CHARGE, chargeId);
        try {
            Refund.create(refundParams);
        } catch (StripeException e) {
            LOGGER.error(REFUND_FAILED, e);
            throw new Forbidden403Exception(REFUND_FAILED);
        }
    }

    @Override
    public void handleGoCardlessEvent(final Event event) {
        if (!goCardlessWebhooksRepository.findByEventId(event.getId()).isPresent()) {
            switch (event.getResourceType()) {
                case MANDATES:
                    handleGoCardlessMandateEvent(event);
                    break;
                case PAYMENTS:
                    hadleGoCardlessPaymentEvent(event);
                    break;
                case REFUNDS:
                    hadleGoCardlessRefundEvent(event);
                    break;
                default:
                    LOGGER.warn("GoCardless webhook event not supported, event {}", event.getAction());
            }
        }
    }

    private void hadleGoCardlessRefundEvent(final Event event) {
        switch (event.getAction()) {
            case CREATED:
                LOGGER.info("Refund {} was created, payment id {}", event.getLinks().getRefund(), event.getLinks().getPayment());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getRefund());
                break;
            case GO_CARDLESS_REFUND_RETURNED:
                LOGGER.info("Refund {} was returned, payment id {}", event.getLinks().getRefund(), event.getLinks().getPayment());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getRefund());
                break;
            default:
                LOGGER.warn("Refund id {} and status {}", event.getLinks().getRefund(), event.getAction());
        }
    }

    private void hadleGoCardlessPaymentEvent(final Event event) {
        switch (event.getAction()) {
            case CREATED:
                LOGGER.info("Payment {} was created", event.getLinks().getPayment());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getPayment());
                break;
            case CONFIRMED:
                LOGGER.info("Payment {} was confirmed", event.getLinks().getPayment());
                handleGoCardlessPaymentSuccess(event.getLinks().getPayment());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getPayment());
                break;
            case FAILED:
                LOGGER.info("Payment {} was failed", event.getLinks().getPayment());
                handleGoCardlessPaymentFailure(event.getLinks().getPayment());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getPayment());
                break;
            case CANCELLED:
                LOGGER.info("Payment {} was cancelled", event.getLinks().getPayment());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getPayment());
                break;
            default:
                LOGGER.warn("Payment id {} and status {}", event.getLinks().getPayment(), event.getAction());
        }
    }

    private void handleGoCardlessMandateEvent(final Event event) {
        switch (event.getAction()) {
            case CREATED:
                LOGGER.info("Mandate {} was submitted", event.getLinks().getMandate());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getMandate());
                break;
            case FAILED:
                LOGGER.info("Mandate {} was failed,cause {}", event.getLinks().getMandate(), event.getDetails().getCause());
                handleGoCardlessMandateCreatingFailure(event.getLinks().getMandate());
                createAndSaveWebhook(event.getId(), event.getAction(), event.getResourceType().name(), event.getLinks().getMandate());
                break;
            default:
                LOGGER.info("Mandates id {} and status {}", event.getLinks().getMandate(), event.getAction());
        }
    }

    private void createAndSaveWebhook(final String evendId, final String eventAction, final String resourceType, final String resourceId) {
        GoCardlessWebhooks goCardlessWebhook = GoCardlessWebhooks.createGoCardlessWebhook(evendId, eventAction, resourceType, resourceId);
        goCardlessWebhooksRepository.save(goCardlessWebhook);
    }

    @Override
    public String createGoCardlessClientForRedirectFlow(String successRedirectUrl) {
        User user = userService.getCurrentUser();
        try {
            GoCardlessClient client = buildGoCardlessClient();
            RedirectFlow redirectFlow = client
                .redirectFlows()
                .create()
                .withScheme(RedirectFlowService.RedirectFlowCreateRequest.Scheme.BECS)
                .withDescription(SHOOTZU)// This will be shown on the payment pages.
                .withSessionToken(user.getId().toString()) // Not the access token
                .withSuccessRedirectUrl(successRedirectUrl)
                .withPrefilledCustomerGivenName(user.getFirstName())
                .withPrefilledCustomerFamilyName(user.getLastName())
                .withPrefilledCustomerEmail(user.getEmail())
                .execute();
            LOGGER.info("Go Cardless redirect flow id: {}", redirectFlow.getId());
            LOGGER.info("Go Cardles redirect flow URL: {}", redirectFlow.getRedirectUrl());
            return redirectFlow.getRedirectUrl();
        } catch (GoCardlessException e) {
            LOGGER.error(REDIRECT_FLOW_FAILED, e);
            throw new Forbidden403Exception(PAYMENT_FAILED);
        }
    }

    @Override
    public String createPaymentWithGoCardless(final String goCardlessMandateId, final BigDecimal pricePerHour,
        final BigDecimal numberOfHours) {
        int amount = PaymentUtil.calculateHalfOfGoCardlessAmount(pricePerHour, numberOfHours);
        try {
            GoCardlessClient client = buildGoCardlessClient();
            com.gocardless.resources.Payment payment = client
                .payments()
                .create()
                .withAmount(amount)
                .withCurrency(com.gocardless.services.PaymentService.PaymentCreateRequest.Currency.AUD)
                .withLinksMandate(goCardlessMandateId)
                .withIdempotencyKey(RandomStringUtils.randomAlphabetic(10))
                .execute();
            LOGGER.info("Go Cardless. Created payment, id: {}", payment.getId());
            return payment.getId();
        } catch (GoCardlessException e) {
            LOGGER.error(GO_CARDLESS_PAYMENT_FAILED, e);
            throw new Forbidden403Exception(CAPTURE_FAILED);
        }
    }

    @Override
    public void retryGoCardlessPayment(final String paymentId) {
        try {
            GoCardlessClient client = buildGoCardlessClient();
            client.payments().retry(paymentId).execute();
        } catch (GoCardlessException e) {
            LOGGER.error(GO_CARDLESS_PAYMENT_RETRY_FAILED, e);
            throw new Forbidden403Exception(CAPTURE_FAILED);
        }
    }

    @Override
    public String completeGoCardlessRedirectFlow(final String redirectId) {
        User user = userService.getCurrentUser();
        try {
            GoCardlessClient client = buildGoCardlessClient();
            RedirectFlow redirectFlow = client.redirectFlows().complete(redirectId).withSessionToken(user.getId().toString()).execute();

            LOGGER.info("GoCardless Redirect Flow. Mandate id :{}", redirectFlow.getLinks().getMandate());
            LOGGER.info("GoCardless Redirect Flow. Customer :{}", redirectFlow.getLinks().getCustomer());
            LOGGER.info("GoCardless Redirect Flow. Confirmation URL :{}", redirectFlow.getConfirmationUrl());

            return redirectFlow.getLinks().getMandate();
        } catch (GoCardlessException e) {
            LOGGER.error(COMPLETE_REDIRECT_FLOW_FAILED, e);
            throw new Forbidden403Exception(CAPTURE_FAILED);
        }
    }

    private GoCardlessClient buildGoCardlessClient() {
        return newBuilder(goCardlessApiKey).withEnvironment(Environment.SANDBOX).build();
    }

    @Scheduled(cron = EVERY_DAY_AT_2_AM)
    public void retryCaptureFailedPayments() {
        List<Offer> offersWithFirstPaymentFiled = offerRepository.findByPaymentStatus(PaymentStatus.FIRST_PAYMENT_FAILED);
        for (Offer offer : offersWithFirstPaymentFiled) {
            if (Objects.nonNull(offer.getGoCardlessFirstPaymentId())) {
                retryGoCardlessPayment(offer.getGoCardlessFirstPaymentId());
                offerService.changeOfferPaymentStatus(offer, PaymentStatus.FIRST_PAYMENT_CAPTURE_RETRIED);
            }
        }
        List<Offer> offersWithSecondPaymentFiled = offerRepository.findByPaymentStatus(PaymentStatus.SECOND_PAYMENT_FAILED);
        for (Offer offer : offersWithSecondPaymentFiled) {
            if (Objects.nonNull(offer.getGoCardlessSecondPaymentId())) {
                retryGoCardlessPayment(offer.getGoCardlessSecondPaymentId());
                offerService.changeOfferPaymentStatus(offer, PaymentStatus.SECOND_PAYMENT_CAPTURE_RETRIED);
            }
        }
    }

    @Override
    public void handleGoCardlessPaymentSuccess(String paymentId) {
        Optional<Offer> optionalOfferWithBothPayments = offerRepository.findByGoCardlessSecondPaymentIdAndGoCardlessFirstPaymentIdIsNotNull(
            paymentId);
        if (optionalOfferWithBothPayments.isPresent()) {
            Offer payedOutOffer = optionalOfferWithBothPayments.get();
            offerService.changeOfferPaymentStatus(payedOutOffer, PaymentStatus.PAYED_OUT);
        }
        Optional<Offer> optionalOfferWithFirstPayment = offerRepository.findByGoCardlessFirstPaymentIdAndGoCardlessSecondPaymentIdIsNull(
            paymentId);
        if (optionalOfferWithFirstPayment.isPresent()) {
            Offer payedOutOffer = optionalOfferWithFirstPayment.get();
            offerService.changeOfferPaymentStatus(payedOutOffer, PaymentStatus.FIRST_PAYMENT_CONFIRMED);
        }
    }

    @Override
    public void handleGoCardlessPaymentFailure(final String paymentId) {
        Optional<Offer> optionalOfferWithFirstPayment = offerRepository.findByGoCardlessFirstPaymentIdAndGoCardlessSecondPaymentIdIsNull(
            paymentId);
        Optional<Offer> optionalOfferWithBothPayments = offerRepository.findByGoCardlessSecondPaymentIdAndGoCardlessFirstPaymentIdIsNotNull(
            paymentId);
        if (optionalOfferWithFirstPayment.isPresent()) {
            Offer offerWithFirstPayment = optionalOfferWithFirstPayment.get();
            Job job = offerWithFirstPayment.getJob();
            if (Objects.equals(offerWithFirstPayment.getPaymentStatus(), PaymentStatus.FIRST_PAYMENT_CAPTURE_RETRIED)) {
                job.setShooter(null);
                jobService.changeJobStatus(job, JobStatus.NEW);
                Optional<Feedback> feedbackFromBusiness = feedbackRepository.findByJobAndAuthor(job, job.getOwner());
                Optional<Feedback> feedbackFromCrew = feedbackRepository.findByJobAndAuthor(job, job.getShooter());
                feedbackFromBusiness.ifPresent(feedback -> feedbackRepository.delete(feedback));
                feedbackFromCrew.ifPresent(feedback -> feedbackRepository.delete(feedback));
                offerRepository.delete(offerWithFirstPayment);
                notificationService.sendGoCardlessDirectDebitFailedSetup(job.getOwner(), job.getTitle(), job.getId());
            } else {
                offerService.changeOfferPaymentStatus(offerWithFirstPayment, PaymentStatus.FIRST_PAYMENT_FAILED);
                notificationService.sendGoCardlessPaymentFailed(job.getOwner(), job.getTitle(), job.getId());
            }
        } else if (optionalOfferWithBothPayments.isPresent()) {
            Offer offerWithBothPayments = optionalOfferWithBothPayments.get();
            Job job = offerWithBothPayments.getJob();
            if (Objects.equals(offerWithBothPayments.getPaymentStatus(), PaymentStatus.SECOND_PAYMENT_CAPTURE_RETRIED)) {
                BigDecimal amount = BigDecimal
                    .valueOf(PaymentUtil.calculateHalfOfGoCardlessAmount(job.getPricePerHour(), job.getNumberOfHours()))
                    .movePointLeft(2);
                emailService.sendRefundEmailToAdmin(offerWithBothPayments.getGoCardlessFirstPaymentId(),
                    offerWithBothPayments.getGoCardlessMandateId(), amount);
                job.setShooter(null);
                jobService.changeJobStatus(job, JobStatus.NEW);
                Optional<Feedback> feedbackFromBusiness = feedbackRepository.findByJobAndAuthor(job, job.getOwner());
                Optional<Feedback> feedbackFromCrew = feedbackRepository.findByJobAndAuthor(job, job.getShooter());
                feedbackFromBusiness.ifPresent(feedback -> feedbackRepository.delete(feedback));
                feedbackFromCrew.ifPresent(feedback -> feedbackRepository.delete(feedback));
                offerRepository.delete(offerWithBothPayments);
                notificationService.sendGoCardlessRetryPaymentFailed(job.getOwner(), job.getTitle(), job.getId());
            } else {
                offerService.changeOfferPaymentStatus(offerWithBothPayments, PaymentStatus.SECOND_PAYMENT_FAILED);
                notificationService.sendGoCardlessPaymentFailed(job.getOwner(), job.getTitle(), job.getId());
            }
        }
    }

    @Override
    public void handleGoCardlessMandateCreatingFailure(final String mandateId) {
        List<Offer> offers = offerRepository.findByGoCardlessMandateId(mandateId);
        for (Offer offer : offers) {
            Job job = offer.getJob();
            if (Objects.equals(job.getJobStatus(), JobStatus.WAITING_FOR_RESPONSE) || Objects.equals(job.getJobStatus(),
                JobStatus.OFFER_ACCEPTED) || Objects.equals(job.getJobStatus(), JobStatus.COMPLETED)) {
                Optional<Feedback> feedbackFromBusiness = feedbackRepository.findByJobAndAuthor(job, job.getOwner());
                Optional<Feedback> feedbackFromCrew = feedbackRepository.findByJobAndAuthor(job, job.getShooter());
                feedbackFromBusiness.ifPresent(feedback -> feedbackRepository.delete(feedback));
                feedbackFromCrew.ifPresent(feedback -> feedbackRepository.delete(feedback));
                job.setShooter(null);
                jobService.changeJobStatus(job, JobStatus.NEW);
                offerRepository.delete(offer);
                notificationService.sendGoCardlessDirectDebitFailedSetup(job.getOwner(), job.getTitle(), job.getId());
            }
        }
    }

    @Override
    public ResponseEntity<String> handleGoCardlessEvent(String signatureHeader, String webhookBody) {
        try {
            Webhook.parse(webhookBody, signatureHeader, webhookSecretKey).forEach(event -> handleGoCardlessEvent(event));
            return ResponseEntity.ok().build();
        } catch (InvalidSignatureException e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }
}
