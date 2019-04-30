package com.sombrainc.service.impl;

import com.sombrainc.dto.profile.UserProfileDTO;
import com.sombrainc.entity.TemporalImage;
import com.sombrainc.repository.TemporalImageRepository;
import com.sombrainc.service.AmazonStorageService;
import com.sombrainc.service.UserService;
import com.sombrainc.util.DomainFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.List;

import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class ImageServiceImplTest {

    @InjectMocks
    private ImageServiceImpl imageService;

    @Mock
    private UserService userService;

    @Mock
    private TemporalImageRepository temporalImageRepository;

    @Mock
    private AmazonStorageService amazonStorageService;

    private List<String> allTempImages;

    @Before
    public void setUp() {
        allTempImages = List.of("testRequiredImage1", "testRequiredImage2", "testTempImage2");

        when(userService.getCurrentUser()).thenReturn(DomainFactory.createDefaultCurrentUser());
        when(temporalImageRepository.findAllTemporalImageUrlsByUser(DomainFactory.createDefaultCurrentUser())).thenReturn(allTempImages);
    }

    @Test
    public void testDeleteUnneededImages() {
        imageService.deleteUnneededImages(DomainFactory.createUserProfileDTO());
    }

    @Test
    public void testDeleteUnneededImagesWithRequiredImages() {
        imageService.deleteUnneededImages(new UserProfileDTO());
    }

    @Test
    public void testDeleteUnneededImagesWithNoTemporal() {
        when(temporalImageRepository.findAllTemporalImageUrlsByUser(DomainFactory.createDefaultCurrentUser())).thenReturn(null);
        imageService.deleteUnneededImages(DomainFactory.createUserProfileDTO());
    }

    @Test
    public void testDeleteTemporalImages() {
        when(temporalImageRepository.findTemporalImagesByUsers(DomainFactory.createDefaultCurrentUser())).thenReturn(
            List.of(new TemporalImage()));
        imageService.deleteTemporalImages();
    }
}