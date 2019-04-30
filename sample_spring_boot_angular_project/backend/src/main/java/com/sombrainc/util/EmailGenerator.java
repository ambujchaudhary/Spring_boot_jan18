package com.sombrainc.util;

import lombok.extern.slf4j.Slf4j;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Slf4j
public final class EmailGenerator {

    private static final String BASE_URL = "$baseURL$";
    private static final String USER = "$username$";
    private static final String OWNER = "$owner_name$";
    private static final String SHOOTER = "$shooter_name$";
    private static final String LINK = "$link$";
    private static final String BUTTON_TEXT = "$button_text$";
    private static final String ADMIN_NAME = "Admin";
    private static final String JOB_TITLE = "$jobTitle$";
    private static final String JOB_DATE = "$jobDate$";
    private static final String JOB_TYPES = "$jobTypes$";
    private static final String PAYMENT = "$payment$";
    private static final String MANDATE = "$mandate$";
    private static final String AMOUNT = "$amount$";

    private EmailGenerator() {
    }

    private static Reader getFileReader(final String fileName) {
        return new InputStreamReader(EmailGenerator.class.getResourceAsStream(fileName), StandardCharsets.UTF_8);
    }

    public static String generateMailWithUsername(final String name, final String link, final String baseURL, final String emailType,
        final String buttonText) {
        return getMailTemplate(emailType)
            .toString()
            .replace(BASE_URL, baseURL)
            .replace(USER, name)
            .replace(LINK, link)
            .replace(BUTTON_TEXT, buttonText);
    }

    public static String generateRefundEmailToAdmin(String emailType, String paymentId, String mandateId, String amount) {
        return getMailTemplate(emailType).toString().replace(PAYMENT, paymentId).replace(MANDATE, mandateId).replace(AMOUNT, amount);
    }

    public static String generateNotificationToAdmin(final String link, final String baseURL, String emailType, String buttonText) {
        return generateMailWithUsername(ADMIN_NAME, link, baseURL, emailType, buttonText);
    }

    public static String generateMailWithJobTitle(final String jobTitle, final String link, final String baseURL, final String emailType,
        final String buttonText) {
        return getMailTemplate(emailType)
            .toString()
            .replace(BASE_URL, baseURL)
            .replace(JOB_TITLE, jobTitle)
            .replace(LINK, link)
            .replace(BUTTON_TEXT, buttonText);
    }

    public static String generateMailWithJobTitleAndShooter(final String shooterName, final String jobTitle, final String link,
        final String baseURL, final String emailType, final String buttonText) {
        return getMailTemplate(emailType)
            .toString()
            .replace(BASE_URL, baseURL)
            .replace(SHOOTER, shooterName)
            .replace(JOB_TITLE, jobTitle)
            .replace(LINK, link)
            .replace(BUTTON_TEXT, buttonText);
    }

    public static String generateMailWithJobTitleAndOwnerAndShooter(final String jobTitle, final String ownerName, final String shooterName,
        final String link, final String baseURL, final String emailType, final String buttonText) {
        return getMailTemplate(emailType)
            .toString()
            .replace(BASE_URL, baseURL)
            .replace(JOB_TITLE, jobTitle)
            .replace(OWNER, ownerName)
            .replace(SHOOTER, shooterName)
            .replace(LINK, link)
            .replace(BUTTON_TEXT, buttonText);
    }

    public static String generateMailWithJobDateTypeAndTitle(final String jobDate, final String jobTypes, final String jobTitle,
        final String link, final String baseURL, final String emailType, final String buttonText) {
        return getMailTemplate(emailType)
            .toString()
            .replace(BASE_URL, baseURL)
            .replace(JOB_DATE, jobDate)
            .replace(JOB_TYPES, jobTypes)
            .replace(JOB_TITLE, jobTitle)
            .replace(LINK, link)
            .replace(BUTTON_TEXT, buttonText);
    }

    public static String generateNewMessageMail(final String emailType) {
        return getMailTemplate(emailType).toString();
    }

    private static StringBuilder getMailTemplate(String emailType) {
        BufferedReader bufferedReader = new BufferedReader(getFileReader(emailType));
        StringBuilder stringBuilder = new StringBuilder();
        String ls = System.getProperty("line.separator");
        String line;

        try {
            while ((line = bufferedReader.readLine()) != null) {
                stringBuilder.append(line);
                stringBuilder.append(ls);
            }
        } catch (IOException e) {
            LOGGER.error("Failed to parse template.", e);
        }
        return stringBuilder;
    }

}
