package com.sombrainc.service;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.SubscriberDTO;

public interface SubscriberService {

    RestMessageDTO createSubscriber(SubscriberDTO subscriberDTO);

}
