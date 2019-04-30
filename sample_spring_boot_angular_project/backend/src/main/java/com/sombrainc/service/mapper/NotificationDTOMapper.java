package com.sombrainc.service.mapper;

import com.sombrainc.dto.NotificationDTO;
import com.sombrainc.entity.Notification;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum NotificationDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    NotificationDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Notification.class, NotificationDTO.class)
            .byDefault()
            .customize(new CustomMapper<Notification, NotificationDTO>() {
                @Override
                public void mapAtoB(Notification notification, NotificationDTO notificationDTO, MappingContext context) {
                    notificationDTO.setReceiver(notification.getReceiver().getEmail());
                    notificationDTO.setEventDate(notification.getEventDate().toLocalDate().toString());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public NotificationDTO map(Notification notification) {
        return mapperFacade.map(notification, NotificationDTO.class);
    }
}
