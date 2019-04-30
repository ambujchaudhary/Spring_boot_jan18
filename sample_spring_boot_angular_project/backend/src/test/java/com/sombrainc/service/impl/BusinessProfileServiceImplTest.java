package com.sombrainc.service.impl;

import com.sombrainc.repository.BusinessProfileRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.UserService;
import com.sombrainc.util.DomainFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.junit.Assert.assertNotNull;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class BusinessProfileServiceImplTest {

    @InjectMocks
    private BusinessProfileServiceImpl businessProfileService;

    @Mock
    private UserService userService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private BusinessProfileRepository businessProfileRepository;

    @Before
    public void setUp() {
        when(userService.getCurrentUser()).thenReturn(DomainFactory.createDefaultCurrentUser());
    }

    @Test
    public void testGetBusinessProfile() {
        assertNotNull(businessProfileService.getBusinessProfile());
    }

}