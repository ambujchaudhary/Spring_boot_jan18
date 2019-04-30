package com.sombrainc.service.impl;

import com.sombrainc.dto.SubscriberDTO;
import com.sombrainc.entity.Subscriber;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.repository.SubscriberRepository;
import com.sombrainc.util.DomainFactory;
import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.MockitoJUnitRunner;

import static org.mockito.Mockito.when;

@RunWith(MockitoJUnitRunner.class)
public class SubscriberServiceImplTest {

    @InjectMocks
    private SubscriberServiceImpl subscriberService;

    @Mock
    private SubscriberRepository subscriberRepository;

    @Test
    public void testCreateSubscriber() {
        SubscriberDTO subscriberDTO = new SubscriberDTO();
        Assert.assertTrue(subscriberService.createSubscriber(subscriberDTO).isSuccess());
    }

    @Test(expected = BadRequest400Exception.class)
    public void testCreateSubscriberWithExistedEmail() {
        SubscriberDTO subscriberDTO = new SubscriberDTO();
        when(subscriberRepository.findOneByEmail(subscriberDTO.getEmail())).thenReturn(
            java.util.Optional.of(new Subscriber()));
        Assert.assertTrue(subscriberService.createSubscriber(subscriberDTO).isSuccess());
    }
}