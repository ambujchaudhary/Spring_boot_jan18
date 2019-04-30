package com.sombrainc.exception;

import org.springframework.http.HttpStatus;

public abstract class Abstract4xxException extends RuntimeException {

    private final HttpStatus httpStatus;

    private String technicalMessage;

    public Abstract4xxException(HttpStatus httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
    }

    public Abstract4xxException(HttpStatus httpStatus, String message, Throwable cause) {
        super(message, cause);
        this.httpStatus = httpStatus;
    }

    public Abstract4xxException(HttpStatus httpStatus, String message, String technicalMessage) {
        super(message);
        this.technicalMessage = technicalMessage;
        this.httpStatus = httpStatus;
    }

    public String getTechnicalMessage() {
        return technicalMessage;
    }

    public HttpStatus getHttpStatus() {
        return httpStatus;
    }
}
