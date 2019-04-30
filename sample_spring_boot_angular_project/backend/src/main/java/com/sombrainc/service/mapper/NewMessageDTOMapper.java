package com.sombrainc.service.mapper;

import com.sombrainc.dto.chat.NewMessageDTO;
import com.sombrainc.entity.Message;
import com.sombrainc.entity.enumeration.MessageStatus;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum NewMessageDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    NewMessageDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(NewMessageDTO.class, Message.class)
            .byDefault()
            .customize(new CustomMapper<NewMessageDTO, Message>() {
                @Override
                public void mapAtoB(NewMessageDTO newMessageDTO, Message message, MappingContext context) {
                    message.setStatus(MessageStatus.UNREAD);
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public Message map(NewMessageDTO newMessageDTO) {
        return mapperFacade.map(newMessageDTO, Message.class);
    }
}
