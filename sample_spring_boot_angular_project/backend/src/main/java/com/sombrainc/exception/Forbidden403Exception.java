package com.sombrainc.exception;

import org.springframework.http.HttpStatus;

public class Forbidden403Exception extends Abstract4xxException {

    private static final HttpStatus HTTP_STATUS = HttpStatus.FORBIDDEN;

    public Forbidden403Exception(String message) {
        super(HTTP_STATUS, message);
    }

    public Forbidden403Exception(String message, String technicalMessage) {
        super(HTTP_STATUS, message, technicalMessage);
    }

}
