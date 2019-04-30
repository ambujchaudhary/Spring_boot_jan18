package com.sombrainc.service.mapper;

import com.sombrainc.dto.SubscriberDTO;
import com.sombrainc.entity.Subscriber;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.MapperFacade;

public enum SubscriberMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    SubscriberMapper() {
        BaseMapper.MAPPER_FACTORY.classMap(SubscriberDTO.class, Subscriber.class).byDefault().register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public Subscriber map(SubscriberDTO subscriberDTO) {
        return this.mapperFacade.map(subscriberDTO, Subscriber.class);
    }

}
