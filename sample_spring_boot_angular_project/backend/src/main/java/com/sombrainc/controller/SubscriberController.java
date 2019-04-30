package com.sombrainc.controller;

import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.SubscriberDTO;
import com.sombrainc.service.SubscriberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/public/subscribers")
public class SubscriberController {

    @Autowired
    private SubscriberService subscriberService;

    @PostMapping
    public RestMessageDTO createSubscriber(@RequestBody SubscriberDTO subscriberDTO) {
        return subscriberService.createSubscriber(subscriberDTO);
    }

}
