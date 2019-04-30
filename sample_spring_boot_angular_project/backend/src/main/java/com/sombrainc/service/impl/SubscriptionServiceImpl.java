package com.sombrainc.service.impl;

import com.chargebee.Environment;
import com.chargebee.Result;
import com.chargebee.models.*;
import com.chargebee.models.enums.EventType;
import com.sombrainc.dto.HostedPageDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.subscription.CancelSubscriptionDTO;
import com.sombrainc.dto.subscription.SubscriptionDTO;
import com.sombrainc.entity.ChargebeeData;
import com.sombrainc.entity.FreeTier;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.SubscriptionStatus;
import com.sombrainc.entity.enumeration.SubscriptionType;
import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.Forbidden403Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.ChargebeeDataRepository;
import com.sombrainc.repository.FreeTierRepository;
import com.sombrainc.repository.SubscriptionRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.SubscriptionService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.SubscriptionDTOMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.chargebee.models.HostedPage.State.SUCCEEDED;
import static com.chargebee.models.Subscription.Status.*;

@Slf4j
@EnableScheduling
@Service
public class SubscriptionServiceImpl implements SubscriptionService, InitializingBean {

    @Value("${chargebee.api.site}")
    private String site;

    @Value("${chargebee.api.key}")
    private String apiKey;

    private static final String EVERY_DAY_AT_1_AM = "0 0 01 * * *";

    private static final String SUBSCRIPTION_NOT_FOUND = "Subscription not found";

    private static final String PORTAL_SESSION_FAILED = "Open portal session failed";

    private static final String CHECKOUT_FAILED = "Create chargebee checkout failed";

    private static final String CUSTOMER_SAVED = "Chargebee data for user: {} successfully saved";

    @Autowired
    private ChargebeeDataRepository chargebeeDataRepository;

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private FreeTierRepository freeTierRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Override
    public void afterPropertiesSet() throws Exception {
        Environment.configure(site, apiKey);
    }

    @Override
    public void handleApplication() {
        String email = userService.getCurrentUserEmail();
        Optional<com.sombrainc.entity.Subscription> free = subscriptionRepository.findByStatusAndTypeAndUsers_Email(
            SubscriptionStatus.ACTIVE, SubscriptionType.FREE, email);
        if (free.isPresent()) {
            Optional<FreeTier> freeTierOptional = freeTierRepository.findByUser_Email(email);
            if (freeTierOptional.isPresent()) {
                FreeTier freeTier = freeTierOptional.get();
                if (freeTier.getApplications() == 0) {
                    throw new Forbidden403Exception("Limit");
                } else {
                    freeTier.setApplications(freeTier.getApplications() - 1);
                    freeTierRepository.save(freeTier);
                }
            }
        }
    }

    @Override
    public void handlePostJob() {
        String email = userService.getCurrentUserEmail();
        Optional<com.sombrainc.entity.Subscription> free = subscriptionRepository.findByStatusAndTypeAndUsers_Email(
            SubscriptionStatus.ACTIVE, SubscriptionType.FREE, email);
        if (free.isPresent()) {
            Optional<FreeTier> freeTierOptional = freeTierRepository.findByUser_Email(email);
            if (freeTierOptional.isPresent()) {
                FreeTier freeTier = freeTierOptional.get();
                if (freeTier.getJobs() == 0) {
                    throw new Forbidden403Exception("Limit");
                } else {
                    freeTier.setJobs(freeTier.getJobs() - 1);
                    freeTierRepository.save(freeTier);
                }
            }
        }
    }

    @Transactional
    @Scheduled(cron = EVERY_DAY_AT_1_AM)
    public void cancelSubscriptionAfter9Days() {
        List<com.sombrainc.entity.Subscription> subscriptions = subscriptionRepository.findBySubscriptionFailedIsNotNull();
        LocalDateTime todaysDate = LocalDateTime.now();
        for (com.sombrainc.entity.Subscription subscription : subscriptions) {
            if (subscription.getStatus() != SubscriptionStatus.CANCELLED && todaysDate.isAfter(
                subscription.getSubscriptionFailed().plusDays(9L))) {
                cancelSubscription(subscription, false);
                Optional<FreeTier> freeTier = freeTierRepository.findByUser_Email(subscription.getUsers().getEmail());
                if (!freeTier.isPresent()) {
                    createEmptyFreeTier(subscription.getUsers());
                }
                String subscriptionId = createActiveFree(subscription.getUsers().getChargebeeData().getCustomerId());
                LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
                com.sombrainc.entity.Subscription shootzuSubscription = com.sombrainc.entity.Subscription
                    .builder()
                    .users(subscription.getUsers())
                    .subscriptionId(subscriptionId)
                    .status(SubscriptionStatus.ACTIVE)
                    .type(SubscriptionType.FREE)
                    .dateFrom(now)
                    .dateTo(now.plusYears(1))
                    .build();
                subscriptionRepository.save(shootzuSubscription);
                LOGGER.info("Canceling subscription: {} after 9 days", subscription);
            }
        }
    }

    private void handleSubscriptionRenewedEvent(Event event) {
        Subscription subscription = event.content().subscription();
        com.sombrainc.entity.Subscription shootzuSubscription = subscriptionRepository
            .findBySubscriptionId(subscription.id())
            .orElseThrow(() -> new NotFound404Exception(SUBSCRIPTION_NOT_FOUND));
        shootzuSubscription.setDateTo(subscription.nextBillingAt().toLocalDateTime());
        shootzuSubscription.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Subscription with id: {} successfully renewed", subscription.id());
    }

    @Override
    @Transactional
    public RestMessageDTO createSubscription(HostedPageDTO hostedPageDTO) {
        LOGGER.info("Creating subscription");
        Result result = null;
        try {
            result = HostedPage.retrieve(hostedPageDTO.getHostedPageId()).request();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        HostedPage hostedPage = result.hostedPage();
        LOGGER.info("Hosted page state: {}", hostedPage.state());
        if (SUCCEEDED == hostedPage.state()) {
            HostedPage.Content content = hostedPage.content();
            Subscription newSubscription = content.subscription();
            Customer customer = content.customer();
            Optional<com.sombrainc.entity.Subscription> freeSubscription = subscriptionRepository.findByStatusAndTypeAndUsers_Email(
                SubscriptionStatus.ACTIVE, SubscriptionType.FREE, customer.email());
            freeSubscription.ifPresent(subscription -> cancelSubscription(subscription, false));
            Optional<com.sombrainc.entity.Subscription> futureFreeSubscription = subscriptionRepository.findByStatusAndTypeAndUsers_Email(
                SubscriptionStatus.FUTURE, SubscriptionType.FREE, customer.email());
            futureFreeSubscription.ifPresent(subscription -> cancelSubscription(subscription, false));
            SubscriptionType newType = SubscriptionType.of(newSubscription.planId());
            switch (newType) {
                case MONTHLY:
                    Optional<com.sombrainc.entity.Subscription> annual = subscriptionRepository.findByStatusAndTypeAndUsers_Email(
                        SubscriptionStatus.ACTIVE, SubscriptionType.ANNUAL, customer.email());
                    if (annual.isPresent()) {
                        com.sombrainc.entity.Subscription annualSubscription = annual.get();
                        cancelSubscription(annualSubscription, true);
                    }
                    break;
                case ANNUAL:
                    Optional<com.sombrainc.entity.Subscription> monthly = subscriptionRepository.findByStatusAndTypeAndUsers_Email(
                        SubscriptionStatus.ACTIVE, SubscriptionType.MONTHLY, customer.email());
                    if (monthly.isPresent()) {
                        com.sombrainc.entity.Subscription monthlySubscription = monthly.get();
                        cancelSubscription(monthlySubscription, true);
                    }
                    break;
                default:
                    throw new BadRequest400Exception("Subscription type not supported");
            }
            User user = userRepository.findOneByEmail(customer.email()).orElseThrow(() -> new NotFound404Exception("User not found!"));
            if (user.getChargebeeData() == null) {
                ChargebeeData chargebeeData = ChargebeeData.builder().customerId(customer.id()).users(user).build();
                chargebeeDataRepository.save(chargebeeData);
                LOGGER.info(CUSTOMER_SAVED, user.getEmail());
                userService.changeUserStatus(user, UserStatus.NO_BUSINESS);
            }
            SubscriptionStatus status;
            if (FUTURE.equals(newSubscription.status())) {
                status = SubscriptionStatus.FUTURE;
            } else if (ACTIVE.equals(newSubscription.status())) {
                status = SubscriptionStatus.ACTIVE;
            } else if (NON_RENEWING.equals(newSubscription.status())) {
                status = SubscriptionStatus.NON_RENEWING;
            } else {
                status = SubscriptionStatus.CANCELLED;
            }
            com.sombrainc.entity.Subscription shootzuSubscription = com.sombrainc.entity.Subscription
                .builder()
                .users(user)
                .subscriptionId(newSubscription.id())
                .status(status)
                .type(newType)
                .dateFrom(newSubscription.startDate() == null ? LocalDateTime.now() : newSubscription.startDate().toLocalDateTime())
                .dateTo(calculateNextBillingDate(newSubscription.nextBillingAt().toLocalDateTime(), newType, status))
                .build();
            subscriptionRepository.save(shootzuSubscription);
            LOGGER.info("Subscription for user: {} successfully created", user.getEmail());
            return RestMessageDTO.createSuccessRestMessageDTO("Subscription created");
        } else {
            return RestMessageDTO.createSuccessRestMessageDTO("Subscription post cancelled");
        }
    }

    private LocalDateTime calculateNextBillingDate(LocalDateTime date, SubscriptionType type, SubscriptionStatus status) {
        if (SubscriptionStatus.FUTURE.equals(status) && SubscriptionType.MONTHLY.equals(type)) {
            return date.plusMonths(1);
        } else if (SubscriptionStatus.FUTURE.equals(status) && SubscriptionType.ANNUAL.equals(type)) {
            return date.plusYears(1);
        }
        return date;
    }

    @Override
    @Transactional
    public RestMessageDTO downgradeToFree() {
        User currentUser = userService.getCurrentUser();
        Optional<com.sombrainc.entity.Subscription> free = subscriptionRepository.findByStatusAndTypeAndUsers_Email(
            SubscriptionStatus.ACTIVE, SubscriptionType.FREE, currentUser.getEmail());
        if (free.isPresent()) {
            throw new BadRequest400Exception("You already have free subscription");
        }
        LOGGER.info("Creating free subscription for user: {}", currentUser.getEmail());
        Optional<FreeTier> freeTier = freeTierRepository.findByUser_Email(currentUser.getEmail());
        if (!freeTier.isPresent()) {
            createEmptyFreeTier(currentUser);
        }
        String customerId = currentUser.getChargebeeData().getCustomerId();
        Optional<com.sombrainc.entity.Subscription> future = subscriptionRepository.findByStatusAndUsers_Email(SubscriptionStatus.FUTURE,
            currentUser.getEmail());

        Optional<com.sombrainc.entity.Subscription> nonRenewing = subscriptionRepository.findByStatusAndUsers_Email(
            SubscriptionStatus.NON_RENEWING, currentUser.getEmail());

        Optional<com.sombrainc.entity.Subscription> active = subscriptionRepository.findByStatusAndUsers_Email(SubscriptionStatus.ACTIVE,
            currentUser.getEmail());

        String subscriptionId;
        SubscriptionStatus status = SubscriptionStatus.FUTURE;
        LocalDateTime dateFrom;

        if (future.isPresent()) {
            cancelSubscription(future.get(), false);
            if (nonRenewing.isPresent()) {
                dateFrom = nonRenewing.get().getDateTo();
                subscriptionId = createFutureFree(customerId, dateFrom);
            } else {
                throw new BadRequest400Exception("Only future subscription");
            }
        } else if (nonRenewing.isPresent()) {
            dateFrom = nonRenewing.get().getDateTo();
            subscriptionId = createFutureFree(customerId, dateFrom);
        } else if (active.isPresent()) {
            dateFrom = active.get().getDateTo();
            cancelSubscription(active.get(), true);
            subscriptionId = createFutureFree(customerId, dateFrom);
        } else {
            dateFrom = LocalDateTime.now(ZoneId.systemDefault());
            subscriptionId = createActiveFree(customerId);
            status = SubscriptionStatus.ACTIVE;
        }

        com.sombrainc.entity.Subscription shootzuSubscription = com.sombrainc.entity.Subscription
            .builder()
            .users(currentUser)
            .subscriptionId(subscriptionId)
            .status(status)
            .type(SubscriptionType.FREE)
            .dateFrom(dateFrom)
            .dateTo(dateFrom.plusYears(1))
            .build();
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Downgraded to free for user {}", currentUser.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Free subscription created");
    }

    @Override
    @Transactional
    public RestMessageDTO createNewFreeSubscription() {
        User user = userService.getCurrentUser();
        String customerId = createChargebeeCustomer(user);
        ChargebeeData chargebeeData = ChargebeeData.builder().customerId(customerId).users(user).build();
        chargebeeDataRepository.save(chargebeeData);
        LOGGER.info(CUSTOMER_SAVED, user.getEmail());
        String subscriptionId = createActiveFree(customerId);
        createFreeTier(user);
        LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
        com.sombrainc.entity.Subscription shootzuSubscription = com.sombrainc.entity.Subscription
            .builder()
            .users(user)
            .subscriptionId(subscriptionId)
            .status(SubscriptionStatus.ACTIVE)
            .type(SubscriptionType.FREE)
            .dateFrom(now)
            .dateTo(now.plusYears(1))
            .build();
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Created new free subscription for user: {} successfully created", user.getEmail());
        userService.changeUserStatus(user, UserStatus.NO_BUSINESS);
        return RestMessageDTO.createSuccessRestMessageDTO("Free subscription created");
    }

    private void createFreeTier(User user) {
        freeTierRepository.save(FreeTier.createNew(user));
    }

    private void createEmptyFreeTier(User user) {
        freeTierRepository.save(FreeTier.createEmpty(user));
    }

    private void cancelSubscription(com.sombrainc.entity.Subscription subscription, boolean endOfTerm) {
        try {
            Subscription.cancel(subscription.getSubscriptionId()).endOfTerm(endOfTerm).request();
            if (endOfTerm) {
                subscription.setStatus(SubscriptionStatus.NON_RENEWING);
            } else {
                subscription.setStatus(SubscriptionStatus.CANCELLED);
            }
            subscriptionRepository.save(subscription);
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    private void handlePaymentFailedEvent(Event event) {
        String subscriptionId = event.content().invoice().subscriptionId();
        com.sombrainc.entity.Subscription shootzuSubscription = subscriptionRepository
            .findBySubscriptionId(subscriptionId)
            .orElseThrow(() -> new NotFound404Exception(SUBSCRIPTION_NOT_FOUND));
        if (shootzuSubscription.getSubscriptionFailed() == null) {
            shootzuSubscription.setSubscriptionFailed(LocalDateTime.now());
            subscriptionRepository.save(shootzuSubscription);
            LOGGER.info("Payment failed for subscription with id: {} ", subscriptionId);
        }
    }

    private void handlePaymentSucceededEvent(Event event) {
        String subscriptionId = event.content().invoice().subscriptionId();
        com.sombrainc.entity.Subscription shootzuSubscription = subscriptionRepository
            .findBySubscriptionId(subscriptionId)
            .orElseThrow(() -> new NotFound404Exception(SUBSCRIPTION_NOT_FOUND));
        if (shootzuSubscription.getSubscriptionFailed() != null) {
            shootzuSubscription.setSubscriptionFailed(null);
            subscriptionRepository.save(shootzuSubscription);
            LOGGER.info("Payment succeeded for subscription with id: {} ", subscriptionId);
        }
    }

    private void handleSubscriptionActivatedEvent(Event event) {
        Subscription subscription = event.content().subscription();
        com.sombrainc.entity.Subscription shootzuSubscription = subscriptionRepository
            .findBySubscriptionId(subscription.id())
            .orElseThrow(() -> new NotFound404Exception(SUBSCRIPTION_NOT_FOUND));
        shootzuSubscription.setStatus(SubscriptionStatus.ACTIVE);
        shootzuSubscription.setDateTo(subscription.nextBillingAt().toLocalDateTime());
        shootzuSubscription.setSubscriptionFailed(null);
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Subscription with id: {} activated ", subscription.id());
    }

    private void handleSubscriptionCancelledEvent(Event event) {
        Subscription subscription = event.content().subscription();
        com.sombrainc.entity.Subscription shootzuSubscription = subscriptionRepository
            .findBySubscriptionId(subscription.id())
            .orElseThrow(() -> new NotFound404Exception(SUBSCRIPTION_NOT_FOUND));
        shootzuSubscription.setStatus(SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Subscription with id: {} canceled ", subscription.id());
    }

    private void handleSubscriptionChangedEvent(Event event) {
        LOGGER.info("Subscription changed event");
        Subscription subscription = event.content().subscription();
        com.sombrainc.entity.Subscription shootzuSubscription = subscriptionRepository
            .findBySubscriptionId(subscription.id())
            .orElseThrow(() -> new NotFound404Exception(SUBSCRIPTION_NOT_FOUND));
        shootzuSubscription.setDateTo(subscription.nextBillingAt().toLocalDateTime());
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Subscription with id: {} changed", subscription.id());
    }

    private void handleSubscriptionStartedEvent(Event event) {
        LOGGER.info("Subscription started event");
        Subscription subscription = event.content().subscription();
        com.sombrainc.entity.Subscription shootzuSubscription = subscriptionRepository
            .findBySubscriptionId(subscription.id())
            .orElseThrow(() -> new NotFound404Exception(SUBSCRIPTION_NOT_FOUND));
        shootzuSubscription.setStatus(SubscriptionStatus.ACTIVE);
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Subscription with id: {} started", subscription.id());
    }

    @Override
    public synchronized void handleWebhookEvent(Event event) {
        EventType eventType = event.eventType();
        switch (eventType) {
            case SUBSCRIPTION_RENEWED:
                handleSubscriptionRenewedEvent(event);
                break;
            case PAYMENT_FAILED:
                handlePaymentFailedEvent(event);
                break;
            case PAYMENT_SUCCEEDED:
                handlePaymentSucceededEvent(event);
                break;
            case SUBSCRIPTION_ACTIVATED:
                handleSubscriptionActivatedEvent(event);
                break;
            case SUBSCRIPTION_CANCELLED:
                handleSubscriptionCancelledEvent(event);
                break;
            case SUBSCRIPTION_REACTIVATED:
                handleSubscriptionActivatedEvent(event);
                break;
            case SUBSCRIPTION_CHANGED:
                handleSubscriptionChangedEvent(event);
                break;
            case SUBSCRIPTION_STARTED:
                handleSubscriptionStartedEvent(event);
                break;
            default:
                LOGGER.info("webhook: {}", eventType);
                break;
        }
    }

    @Override
    public List<SubscriptionDTO> getSubscriptionInfo() {
        String email = userService.getCurrentUserEmail();
        Optional<FreeTier> freeTier = freeTierRepository.findByUser_Email(email);
        if (freeTier.isPresent()) {
            return subscriptionRepository
                .findNotCancelledSubscriptions(email)
                .stream()
                .map(SubscriptionDTOMapper.INSTANCE::map)
                .map(s -> setFreeTier(s, freeTier.get()))
                .collect(Collectors.toList());
        } else {
            return subscriptionRepository
                .findNotCancelledSubscriptions(email)
                .stream()
                .map(SubscriptionDTOMapper.INSTANCE::map)
                .collect(Collectors.toList());
        }
    }

    private SubscriptionDTO setFreeTier(SubscriptionDTO subscriptionDTO, FreeTier freeTier) {
        if (SubscriptionType.FREE.toString().equals(subscriptionDTO.getSubscriptionType())) {
            subscriptionDTO.setJobs(freeTier.getJobs());
            subscriptionDTO.setApplications(freeTier.getApplications());
        }
        return subscriptionDTO;
    }

    @Override
    public String openPortalSession() {
        User user = userService.getCurrentUser();
        String customerId = user.getChargebeeData().getCustomerId();
        try {
            Result result = PortalSession.create().customerId(customerId).request();
            PortalSession portalSession = result.portalSession();
            return portalSession.jsonObj.toString();
        } catch (Exception e) {
            LOGGER.error(PORTAL_SESSION_FAILED);
        }
        throw new BadRequest400Exception(PORTAL_SESSION_FAILED);
    }

    @Override
    public String createNewChargebeeCheckout(String planId) {
        User user = userService.getCurrentUser();
        LOGGER.info("Creating chargebee checkout by user: {}", user.getEmail());
        try {
            Result result = HostedPage
                .checkoutNew()
                .subscriptionPlanId(planId)
                .customerEmail(user.getEmail())
                .customerFirstName(user.getFirstName())
                .customerLastName(user.getLastName())
                .request();
            HostedPage hostedPage = result.hostedPage();
            return hostedPage.jsonObj.toString();
        } catch (Exception e) {
            LOGGER.error(CHECKOUT_FAILED, e);
        }
        throw new BadRequest400Exception(CHECKOUT_FAILED);
    }

    @Override
    public String createExistingChargebeeCheckout(String planId) {
        User user = userService.getCurrentUser();
        LOGGER.info("Creating chargebee checkout by user: {}", user.getEmail());
        SubscriptionType newType = SubscriptionType.of(planId);
        String customerId = user.getChargebeeData().getCustomerId();
        switch (newType) {
            case MONTHLY:
                Optional<com.sombrainc.entity.Subscription> annual = subscriptionRepository.findActiveAndNonRenewingByTypeForUser(
                    SubscriptionType.ANNUAL, user.getEmail());
                if (annual.isPresent()) {
                    LocalDateTime dateTo = annual.get().getDateTo();
                    return createHostedPageForFuture(planId, dateTo, customerId);
                } else {
                    return createHostedPage(planId, customerId);
                }
            case ANNUAL:
                Optional<com.sombrainc.entity.Subscription> monthly = subscriptionRepository.findActiveAndNonRenewingByTypeForUser(
                    SubscriptionType.MONTHLY, user.getEmail());
                if (monthly.isPresent()) {
                    LocalDateTime dateTo = monthly.get().getDateTo();
                    return createHostedPageForFuture(planId, dateTo, customerId);
                } else {
                    return createHostedPage(planId, customerId);
                }
            default:
                throw new BadRequest400Exception("Subscription type not supported");
        }
    }

    private String createHostedPageForFuture(String planId, LocalDateTime dateTo, String customerId) {
        try {
            Result result = HostedPage
                .checkoutNew()
                .subscriptionPlanId(planId)
                .subscriptionStartDate(Timestamp.valueOf(dateTo))
                .customerId(customerId)
                .request();
            HostedPage hostedPage = result.hostedPage();
            return hostedPage.jsonObj.toString();
        } catch (Exception e) {
            LOGGER.error(CHECKOUT_FAILED, e);
        }
        throw new BadRequest400Exception(CHECKOUT_FAILED);
    }

    private String createHostedPage(String planId, String customerId) {
        try {
            Result result = HostedPage.checkoutNew().subscriptionPlanId(planId).customerId(customerId).request();
            HostedPage hostedPage = result.hostedPage();
            return hostedPage.jsonObj.toString();
        } catch (Exception e) {
            LOGGER.error(CHECKOUT_FAILED, e);
        }
        throw new BadRequest400Exception(CHECKOUT_FAILED);
    }

    private String createChargebeeCustomer(User user) {
        try {
            Result result = Customer.create().firstName(user.getFirstName()).lastName(user.getLastName()).email(user.getEmail()).request();
            return result.customer().id();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        throw new BadRequest400Exception("Chargebee customer wasn't created");
    }

    private String createActiveFree(String customerId) {
        try {
            Result result = Subscription.createForCustomer(customerId).planId(SubscriptionType.FREE.getPlan()).request();
            return result.subscription().id();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        throw new BadRequest400Exception("Subscription wasn't created");
    }

    private String createFutureFree(String customerId, LocalDateTime dateFrom) {
        try {
            Result result = Subscription
                .createForCustomer(customerId)
                .planId(SubscriptionType.FREE.getPlan())
                .startDate(Timestamp.valueOf(dateFrom))
                .request();
            return result.subscription().id();
        } catch (Exception e) {
            LOGGER.error(e.getMessage(), e);
        }
        throw new BadRequest400Exception("Subscription wasn't created");
    }

    @Override
    public RestMessageDTO cancelSubscription(CancelSubscriptionDTO cancelSubscriptionDTO) {
        User currentUser = userService.getCurrentUser();
        Optional<FreeTier> freeTier = freeTierRepository.findByUser_Email(currentUser.getEmail());
        if (!freeTier.isPresent()) {
            createEmptyFreeTier(currentUser);
        }
        switch (cancelSubscriptionDTO.getSubscriptionType()) {
            case ANNUAL:
                subscriptionRepository
                    .findByStatusAndTypeForUser(SubscriptionStatus.ACTIVE, SubscriptionType.ANNUAL, currentUser.getEmail())
                    .ifPresent(this::cancelActiveSubscription);
                subscriptionRepository
                    .findByStatusAndTypeForUser(SubscriptionStatus.FUTURE, SubscriptionType.ANNUAL, currentUser.getEmail())
                    .ifPresent(this::cancelFutureSubscription);
                break;
            case MONTHLY:
                subscriptionRepository
                    .findByStatusAndTypeForUser(SubscriptionStatus.ACTIVE, SubscriptionType.MONTHLY, currentUser.getEmail())
                    .ifPresent(this::cancelActiveSubscription);
                subscriptionRepository
                    .findByStatusAndTypeForUser(SubscriptionStatus.FUTURE, SubscriptionType.MONTHLY, currentUser.getEmail())
                    .ifPresent(this::cancelFutureSubscription);
                break;
        }
        return RestMessageDTO.createSuccessRestMessageDTO("Subscription cancelled");
    }

    private void cancelActiveSubscription(com.sombrainc.entity.Subscription subscription) {
        cancelSubscription(subscription, true);
        subscription.setSubscriptionFailed(null);
        subscription.setStatus(SubscriptionStatus.NON_RENEWING);
        subscriptionRepository.save(subscription);
        User user = subscription.getUsers();
        LocalDateTime dateFrom = subscription.getDateTo();
        String subscriptionId = createFutureFree(subscription.getUsers().getChargebeeData().getCustomerId(), dateFrom);
        com.sombrainc.entity.Subscription shootzuSubscription = com.sombrainc.entity.Subscription
            .builder()
            .users(user)
            .subscriptionId(subscriptionId)
            .status(SubscriptionStatus.FUTURE)
            .type(SubscriptionType.FREE)
            .dateFrom(dateFrom)
            .dateTo(dateFrom.plusYears(1))
            .build();
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Subscription with id: {} successfully canceled", subscription.getId());
    }

    private void cancelFutureSubscription(com.sombrainc.entity.Subscription subscription) {
        cancelSubscription(subscription, false);
        subscription.setSubscriptionFailed(null);
        subscription.setStatus(SubscriptionStatus.CANCELLED);
        subscriptionRepository.save(subscription);
        User user = subscription.getUsers();
        LocalDateTime dateFrom = subscription.getDateFrom();
        String subscriptionId = createFutureFree(user.getChargebeeData().getCustomerId(), subscription.getDateFrom());
        com.sombrainc.entity.Subscription shootzuSubscription = com.sombrainc.entity.Subscription
            .builder()
            .users(user)
            .subscriptionId(subscriptionId)
            .status(SubscriptionStatus.FUTURE)
            .type(SubscriptionType.FREE)
            .dateFrom(dateFrom)
            .dateTo(dateFrom.plusYears(1))
            .build();
        subscriptionRepository.save(shootzuSubscription);
        LOGGER.info("Subscription with id: {} successfully canceled", subscription.getId());
    }

    @Override
    public boolean hasReachedLimit(String email) {
        Optional<com.sombrainc.entity.Subscription> limit = subscriptionRepository.findApplicationLimit(email);
        return limit.isPresent();
    }

    @Override
    public void updateCancel() {
        List<com.sombrainc.entity.Subscription> cancelled = subscriptionRepository.findByStatus(SubscriptionStatus.CANCELLED);
        for (com.sombrainc.entity.Subscription subscription : cancelled) {
            User user = subscription.getUsers();
            createEmptyFreeTier(user);
            String customerId = user.getChargebeeData().getCustomerId();
            String subscriptionId = createActiveFree(customerId);
            LocalDateTime now = LocalDateTime.now(ZoneId.systemDefault());
            com.sombrainc.entity.Subscription shootzuSubscription = com.sombrainc.entity.Subscription
                .builder()
                .users(user)
                .subscriptionId(subscriptionId)
                .status(SubscriptionStatus.ACTIVE)
                .type(SubscriptionType.FREE)
                .dateFrom(now)
                .dateTo(now.plusYears(1))
                .build();
            subscriptionRepository.save(shootzuSubscription);
        }
    }

    @Override
    public void setDateFrom() {
        List<com.sombrainc.entity.Subscription> all = subscriptionRepository.findAll();
        for (com.sombrainc.entity.Subscription subscription : all) {
            if (subscription.getDateFrom() == null) {
                String subscriptionId = subscription.getSubscriptionId();
                try {
                    Result result = Subscription.retrieve(subscriptionId).request();
                    LocalDateTime dateFrom = result.subscription().createdAt().toLocalDateTime();
                    subscription.setDateFrom(dateFrom);
                    subscriptionRepository.save(subscription);
                } catch (Exception e) {
                    LOGGER.error(e.getMessage(), e);
                }
            }
        }
    }
}
