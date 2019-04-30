package com.sombrainc.exception;

import org.springframework.http.HttpStatus;

public class NotFound404Exception extends Abstract4xxException {

    private static final HttpStatus HTTP_STATUS = HttpStatus.NOT_FOUND;

    public NotFound404Exception(String message) {
        super(HTTP_STATUS, message);
    }

    public NotFound404Exception(String message, String technicalMessage) {
        super(HTTP_STATUS, message, technicalMessage);
    }

}
