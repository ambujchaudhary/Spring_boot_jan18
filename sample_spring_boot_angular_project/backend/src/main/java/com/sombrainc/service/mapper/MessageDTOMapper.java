package com.sombrainc.service.mapper;

import com.sombrainc.dto.chat.ChatMemberDTO;
import com.sombrainc.dto.chat.MessageDTO;
import com.sombrainc.dto.job.ChatJobDTO;
import com.sombrainc.entity.Message;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum MessageDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    MessageDTOMapper() {
        BaseMapper.MAPPER_FACTORY.classMap(Message.class, MessageDTO.class).byDefault().customize(new CustomMapper<Message, MessageDTO>() {
            @Override
            public void mapAtoB(Message message, MessageDTO messageDTO, MappingContext context) {
                messageDTO.setId(message.getId().toString());
                messageDTO.setChatJobDTO(new ChatJobDTO(message.getJob()));
                messageDTO.setSender(ChatMemberDTO.of(message.getSender()));
                messageDTO.setRecipient(ChatMemberDTO.of(message.getRecipient()));
                messageDTO.setSentDate(message.getCreatedAt());
            }
        }).register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public MessageDTO map(Message message) {
        return mapperFacade.map(message, MessageDTO.class);
    }
}
