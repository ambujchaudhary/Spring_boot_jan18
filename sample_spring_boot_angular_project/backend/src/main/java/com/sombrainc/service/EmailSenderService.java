package com.sombrainc.service;

public interface EmailSenderService {

    void sendMail(final String to, final String subject, final String content);

}
