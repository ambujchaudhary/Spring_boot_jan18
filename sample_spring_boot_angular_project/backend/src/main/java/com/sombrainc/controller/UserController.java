package com.sombrainc.controller;

import com.sombrainc.dto.*;
import com.sombrainc.dto.job.JobOwnerDTO;
import com.sombrainc.security.jwt.JWTConfigurer;
import com.sombrainc.security.jwt.JWTTokenDTO;
import com.sombrainc.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletResponse;

@Slf4j
@CrossOrigin(allowCredentials = "true")
@RestController
public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/api/public/login")
    public JWTTokenDTO authorize(HttpServletResponse response, @RequestBody LoginUserDTO loginUserDTO) {
        JWTTokenDTO tokenDTO = userService.authenticateUser(loginUserDTO.getEmail(), loginUserDTO.getPassword());
        response.addHeader(JWTConfigurer.AUTHORIZATION_HEADER, "Bearer " + tokenDTO.getToken());
        return tokenDTO;
    }

    @GetMapping("/api/public/user")
    public AuthUserDTO getUser() {
        return userService.getLoginAuthUserDTO();
    }

    @PostMapping("/api/public/user")
    public JWTTokenDTO signUp(@RequestBody UserRegistrationDTO registrationDTO) {
        return userService.createUser(registrationDTO);
    }

    @PutMapping("/api/public/user")
    public JWTTokenDTO signUp(@RequestBody SocialUserRegistrationDTO registrationDTO) {
        return userService.completeUserRegistration(registrationDTO);
    }

    @PutMapping("/api/protected/user")
    public RestMessageDTO changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {
        return userService.changePassword(changePasswordDTO);
    }

    @PostMapping("/api/public/forgot")
    public RestMessageDTO forgotPassword(@RequestBody ForgotPasswordDTO forgotPasswordDTO) {
        return userService.sendForgotPasswordEmail(forgotPasswordDTO);
    }

    @PostMapping("/api/public/change-password")
    public RestMessageDTO confirmChangePassword(@RequestBody RestorePasswordDTO restorePasswordDTO) {
        return userService.checkAndChangePassword(restorePasswordDTO);
    }

    @GetMapping("/api/protected/full-name")
    public JobOwnerDTO getJobOwnerDTO() {
        return userService.getJobOwnerDTO();
    }

    @GetMapping("/api/private/users/{id}/full-name")
    public JobOwnerDTO getJobOwnerDTOForAdmin(@PathVariable(value = "id") final Long userId) {
        return userService.getJobOwnerDTOForAdmin(userId);
    }

    @PutMapping("/api/private/users/{id}/block")
    public RestMessageDTO blockUser(@PathVariable(value = "id") final Long userId) {
        return userService.blockUser(userId);
    }

    @PutMapping("/api/private/users/{id}/unblock")
    public RestMessageDTO unblockUser(@PathVariable(value = "id") final Long userId) {
        return userService.unblockUser(userId);
    }
}
