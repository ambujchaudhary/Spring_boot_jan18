package com.sombrainc.entity.enumeration;

import lombok.Getter;

@Getter
public enum NotificationType {

    NEW_APPLICANTS("New Applicants", "You have new applicants for %s. View and hire at [[url=/job/%s/view]]job page[[url]]",
        "/job/%s/view"),
    PROFILE_APPROVED("Profile Approved",
        "Welcome to Shootzu! Your profile has been approved and your account is now active. Be Crew, Find Crew", "/dashboard"),
    PROFILE_DECLINED("Profile Declined",
        "Your Shootzu account is almost there but we need some more information before we can set up your profile", "/dashboard"),
    OFFER_SENT("Job Offer is sent", "Congratulations! You have been offered a new [[url=/job/%s/view]]job[[url]].\n"
        + "VERY IMPORTANT: You must accept this offer within 48 hours!", "/job/%s/view"),
    OFFER_ACCEPTED("Crew Confirmed",
        "Congratulations! %s has accepted the job for %s and payment processed. View job and contact crew [[url=/job/%s/view]]here[[url]]",
        "/job/%s/view"),
    OFFER_DECLINED("Offer Declined",
        "Unfortunately %s is no longer available for %s. Your pre-auth payment has been refunded. View and hire other [[url=/job/%s/view]]applicants[[url]].",
        "/job/%s/view"),
    JOB_EDITED("Job Edited",
        "A [[url=/job/%s/view]]job[[url]] you have applied for has been edited. Please check the new brief to ensure you’re still interested",
        "/job/%s/view"),
    UPCOMING_JOB("Reminder", "Are you ready? You have a job starting in 3 days. View the details [[url=/job/%s/view]]here[[url]]",
        "/job/%s/view"),
    TODAY_JOB("Good Luck", "Good luck for your job today, from the Zu Crew.", "/dashboard"),
    SHOOTER_NOT_COMPLETED("Reminder", "Don’t forget to deliver your files to %s in the next few days.", "/dashboard"),
    BUSINESS_NOT_COMPLETED("Reminder",
        "Don’t forget to complete the [[url=/job/%s/view]]job[[url]] and rate your crew for %s. Payment will be released in 5 days.",
        "/job/%s/view"),
    NEW_JOB_IN_RADIUS("Job Alert",
        "A new job is available in your area! View the details and apply by [[url=/job/%s/view]]clicking here[[url]]", "/job/%s/view"),
    OFFER_PAYED_OUT("Job Funded",
        "Your upcoming job with %s for %s has now been fully funded. View job details and contact crew [[url=/job/%s/view]]here[[url]]",
        "/job/%s/view"),
    DIRECT_DEBIT_FAILED("GoCardless Direct Debit setting up was failed",
        "Unfortunately setting up Direct Debit was failed for %s. View and hire other [[url=/job/%s/view]]applicants[[url]].",
        "/job/%s/view"),
    PAYMENT_FAILED("GoCardless Direct Debit payment was failed",
        "Unfortunately GoCardless Direct Debit payment was failed for %s. Payment will be charged again tomorrow. Please check your bank account.",
        "/dashboard"),
    RETRY_PAYMENT_FAILED("GoCardless Direct Debit retry was failed",
        "Unfortunately GoCardless Direct Debit payment was failed for %s.Your pre-auth payment has been refunded. View and hire other [[url=/job/%s/view]]applicants[[url]].",
        "/job/%s/view"),
    APPLICATION_UPDATE("Application Update", "Thank you for your application to %s. Unfortunately you have not been selected on this occasion. This application has been [[url=/find-job?tab=archived]]archived[[url]]", "/find-job?tab=archived");

    private String title;

    private String body;

    private String url;

    NotificationType(String title, String body, String url) {
        this.title = title;
        this.body = body;
        this.url = url;
    }
}
