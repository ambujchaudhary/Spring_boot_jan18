package com.sombrainc.service.impl;

import com.sombrainc.dto.profile.UserProfileDTO;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.repository.UserProfileRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.EmailService;
import com.sombrainc.service.UserService;
import com.sombrainc.util.DomainFactory;
import org.junit.Assert;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class UserProfileServiceImplTest {

    @InjectMocks
    private UserProfileServiceImpl userProfileService;

    @Mock
    private UserService userService;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private ImageServiceImpl imageService;

    @Mock
    private SubscriptionServiceImpl subscriptionService;

    @Mock
    private NotificationServiceImpl notificationService;

    @Before
    public void init() {
        when(userService.getCurrentUser()).thenReturn(DomainFactory.createDefaultCurrentUser());
    }

    @Test(expected = BadRequest400Exception.class)
    public void testEditProfileNotNullValidation() {
        UserProfileDTO profileDTO = new UserProfileDTO();
        userProfileService.editProfile(profileDTO);
    }

    @Test(expected = BadRequest400Exception.class)
    public void testEditProfileVideoValidation() {
        userProfileService.editProfile(new UserProfileDTO());
    }

    @Test(expected = BadRequest400Exception.class)
    public void testSaveAlreadyExistedProfile() {
        UserProfileDTO profileDTO = DomainFactory.createUserProfileDTO();
        Assert.assertTrue(userProfileService.saveProfile(profileDTO).isSuccess());
    }
}
