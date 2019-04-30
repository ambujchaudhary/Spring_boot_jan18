package com.sombrainc.controller;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.Forbidden403Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.exception.Unauthorized401Exception;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

@ControllerAdvice
public class GlobalControllerExceptionHandler {

    @ExceptionHandler(BadRequest400Exception.class)
    @ResponseBody
    public ResponseEntity<RestMessageDTO> exceptionBadRequest(BadRequest400Exception ex) {
        return new ResponseEntity<>(RestMessageDTO.createFailureRestMessageDTO(ex.getMessage()), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NotFound404Exception.class)
    @ResponseBody
    public ResponseEntity<RestMessageDTO> exceptionNotFound(NotFound404Exception ex) {
        return new ResponseEntity<>(RestMessageDTO.createFailureRestMessageDTO(ex.getMessage()), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Unauthorized401Exception.class)
    @ResponseBody
    public ResponseEntity<RestMessageDTO> exceptionUnauthorized(Unauthorized401Exception ex) {
        return new ResponseEntity<>(RestMessageDTO.createFailureRestMessageDTO(ex.getMessage()), HttpStatus.UNAUTHORIZED);
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(AuthenticationException.class)
    @ResponseBody
    public ResponseEntity<RestMessageDTO> handleAuthenticationException(AuthenticationException ex) {
        return new ResponseEntity<>(new RestMessageDTO("login.incorrect_credentials", false), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Forbidden403Exception.class)
    @ResponseBody
    public ResponseEntity<RestMessageDTO> exceptionForbidden(Forbidden403Exception ex) {
        return new ResponseEntity<>(RestMessageDTO.createFailureRestMessageDTO(ex.getMessage()), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(DisabledException.class)
    @ResponseBody
    public ResponseEntity<RestMessageDTO> exceptionBlocked(DisabledException ex) {
        return new ResponseEntity<>(RestMessageDTO.createFailureRestMessageDTO(ex.getMessage()), HttpStatus.FORBIDDEN);
    }
}
