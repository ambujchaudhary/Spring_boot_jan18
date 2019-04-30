package com.sombrainc.exception;

import org.springframework.http.HttpStatus;

public class Unauthorized401Exception extends Abstract4xxException {

    private static final HttpStatus HTTP_STATUS = HttpStatus.UNAUTHORIZED;

    public Unauthorized401Exception(String message) {
        super(HTTP_STATUS, message);
    }

    public Unauthorized401Exception(String message, String technicalMessage) {
        super(HTTP_STATUS, message, technicalMessage);
    }

}
