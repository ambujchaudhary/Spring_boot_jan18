package com.sombrainc.service.impl;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.SubscriberDTO;
import com.sombrainc.entity.Subscriber;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.repository.SubscriberRepository;
import com.sombrainc.service.SubscriberService;
import com.sombrainc.service.mapper.SubscriberMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class SubscriberServiceImpl implements SubscriberService {

    @Autowired
    private SubscriberRepository subscriberRepository;

    @Override
    public RestMessageDTO createSubscriber(SubscriberDTO subscriberDTO) {
        LOGGER.info("Creating subscriber: {}", subscriberDTO);
        if (subscriberRepository.findOneByEmail(subscriberDTO.getEmail()).isPresent()) {
            throw new BadRequest400Exception("Subscriber with this email already exist");
        }
        Subscriber subscriber = SubscriberMapper.INSTANCE.map(subscriberDTO);
        subscriberRepository.save(subscriber);
        LOGGER.info("Subscriber : {} successfully created", subscriber.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Subscriber successfully saved");
    }
}
