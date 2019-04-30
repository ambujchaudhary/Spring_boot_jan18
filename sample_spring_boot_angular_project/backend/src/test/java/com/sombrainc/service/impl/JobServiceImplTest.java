package com.sombrainc.service.impl;

import com.sombrainc.dto.job.JobDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.exception.Forbidden403Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.JobRepository;
import com.sombrainc.service.UserService;
import com.sombrainc.util.DomainFactory;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import java.util.Optional;

import static com.sombrainc.util.DomainFactory.createDefaultCurrentUser;
import static com.sombrainc.util.DomainFactory.createJob;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class JobServiceImplTest {

    @InjectMocks
    private JobServiceImpl jobService;

    @Mock
    private UserService userService;

    @Mock
    private JobRepository jobRepository;

    @Mock
    private SubscriptionServiceImpl subscriptionService;

    @Mock
    private NotificationServiceImpl notificationService;

    @Before
    public void init() {
        when(userService.getCurrentUser()).thenReturn(DomainFactory.createDefaultCurrentUser());
    }

    @Test(expected = NullPointerException.class)
    public void testMapperForSaveJob() {
        JobDTO jobDTO = new JobDTO();
        jobService.saveJob(jobDTO);
    }

    @Test(expected = NotFound404Exception.class)
    public void testGetEmptyJob() {
        Optional<Job> someJob = Optional.empty();
        when(jobRepository.findById(1L)).thenReturn(someJob);
        jobService.getJob(1L);
    }

    @Test(expected = NotFound404Exception.class)
    public void testEditEmptyJob() {
        Optional<Job> someJob = Optional.empty();
        when(jobRepository.findById(1L)).thenReturn(someJob);
        jobService.editJob(1L, DomainFactory.createJobDTO());
    }

    @Test(expected = Forbidden403Exception.class)
    public void testEditJobNotOwner() {
        Optional<Job> someJob = Optional.of(createJob());
        when(jobRepository.findById(1L)).thenReturn(someJob);
        assertTrue(jobService.editJob(1L, DomainFactory.createJobDTO()).isSuccess());
    }

    @Test
    public void testEditJob() {
        Optional<Job> someJob = Optional.of(DomainFactory.createOwnerJob());
        when(jobRepository.findById(1L)).thenReturn(someJob);
        assertTrue(jobService.editJob(1L, DomainFactory.createJobDTO()).isSuccess());
    }

    @Test(expected = Forbidden403Exception.class)
    public void testEditJobWithStatusInProgress() {
        Optional<Job> someJob = Optional.of(new Job());
        when(jobRepository.findById(1L)).thenReturn(someJob);
        assertTrue(jobService.editJob(1L, DomainFactory.createJobDTO()).isSuccess());
    }

    @Test
    public void testGetJobs() {
        when(userService.getCurrentUser()).thenReturn(createDefaultCurrentUser());
        assertNotNull(jobService.getOwnJobs());
    }

}