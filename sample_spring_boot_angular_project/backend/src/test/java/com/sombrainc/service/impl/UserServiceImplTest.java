package com.sombrainc.service.impl;

import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.Unauthorized401Exception;
import com.sombrainc.repository.TemporalLinkRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.EmailService;
import com.sombrainc.service.SettingsService;
import com.sombrainc.service.SubscriptionService;
import com.sombrainc.util.DomainFactory;
import org.apache.commons.lang.StringUtils;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserServiceImplTest {

    @InjectMocks
    private UserServiceImpl userService;
    @Mock
    private UserRepository userRepository;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private AuthenticationManager authenticationManager;
    @Mock
    private SubscriptionService subscriptionService;
    @Mock
    private TemporalLinkRepository temporalLinkRepository;
    @Mock
    private EmailService emailService;
    @Mock
    private SettingsService settingsService;

    @Before
    public void setUp() {

    }

    @Test(expected = BadRequest400Exception.class)
    public void testCreateUserWithIncorrectPassword() {
        userService.createUser(DomainFactory.createUserRegistrationDTOWithIncorrectPassword());
    }

    @Test(expected = BadRequest400Exception.class)
    public void testCreateUserWithExistedEmail() {
        when(userRepository.findOneByEmail(DomainFactory.createUserRegistrationDTO().getEmail())).thenReturn(
            java.util.Optional.ofNullable(DomainFactory.createDefaultCurrentUser()));
        userService.createUser(DomainFactory.createUserRegistrationDTO());
    }

    @Test
    public void testSendForgotPasswordEmail() {
        when(userRepository.findOneByEmail(StringUtils.EMPTY)).thenReturn(
            java.util.Optional.ofNullable(DomainFactory.createDefaultCurrentUser()));
        Assert.assertTrue(userService.sendForgotPasswordEmail(DomainFactory.createForgotPasswordDTO()).isSuccess());
    }

    @Test(expected = BadRequest400Exception.class)
    public void testCheckAndChangePasswordTokenActiveFalse() {
        userService.checkAndChangePassword(DomainFactory.createRestorePasswordDTO());
    }

    @Test(expected = BadRequest400Exception.class)
    public void testCheckAndChangePasswordBadPass() {
        when(temporalLinkRepository.existsByTokenAndActiveIsTrue(StringUtils.EMPTY)).thenReturn(true);
        userService.checkAndChangePassword(DomainFactory.createRestorePasswordDTO());
    }

    @Test(expected = BadRequest400Exception.class)
    public void testCheckAndChangePasswordTempLinkNull() {
        when(temporalLinkRepository.existsByTokenAndActiveIsTrue(StringUtils.EMPTY)).thenReturn(true);
        userService.checkAndChangePassword(DomainFactory.createRestorePasswordDTO());
    }

    @Test(expected = Unauthorized401Exception.class)
    public void testGetCurrentUserWithoutAuthorization() {
        userService.getCurrentUser();
    }

    @Test
    public void testIsEmailExist() {
        when(userRepository.findOneByEmail(StringUtils.EMPTY)).thenReturn(
            java.util.Optional.ofNullable(DomainFactory.createDefaultCurrentUser()));
        Assert.assertTrue(userService.isEmailExist(StringUtils.EMPTY));
    }

    @Test
    public void testIsSocialUserExist() {
        when(userRepository.findOneByEmail(StringUtils.EMPTY)).thenReturn(
            java.util.Optional.ofNullable(DomainFactory.createDefaultCurrentUser()));
        Assert.assertTrue(userService.isSocialUserExist(StringUtils.EMPTY, StringUtils.EMPTY));
    }

}