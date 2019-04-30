package com.sombrainc.service.mapper;

import com.sombrainc.dto.subscription.SubscriptionDTO;
import com.sombrainc.entity.Subscription;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum SubscriptionDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    SubscriptionDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Subscription.class, SubscriptionDTO.class)
            .byDefault()
            .customize(new CustomMapper<Subscription, SubscriptionDTO>() {
                @Override
                public void mapAtoB(Subscription subscription, SubscriptionDTO subscriptionDTO, MappingContext context) {
                    if (subscription.getDateTo() != null) {
                        subscriptionDTO.setDateTo(subscription.getDateTo().toLocalDate().toString());
                    }
                    if (subscription.getDateFrom() != null) {
                        subscriptionDTO.setDateFrom(subscription.getDateFrom().toLocalDate().toString());
                    }
                    subscriptionDTO.setSubscriptionType(subscription.getType().toString());
                    subscriptionDTO.setSubscriptionStatus(subscription.getStatus().toString());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public SubscriptionDTO map(Subscription subscription) {
        return this.mapperFacade.map(subscription, SubscriptionDTO.class);
    }

}
