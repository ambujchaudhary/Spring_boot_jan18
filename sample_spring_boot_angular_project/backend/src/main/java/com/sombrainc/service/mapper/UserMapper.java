package com.sombrainc.service.mapper;

import com.sombrainc.dto.UserRegistrationDTO;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.Role;
import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(UserRegistrationDTO.class, User.class)
            .byDefault()
            .customize(new CustomMapper<UserRegistrationDTO, User>() {
                @Override
                public void mapAtoB(UserRegistrationDTO userRegistrationDTO, User user, MappingContext context) {
                    user.setRole(Role.ROLE_USER);
                    user.setStatus(UserStatus.CHARGEBEE_SIGN_UP);
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public User map(UserRegistrationDTO userRegistrationDTO) {
        return this.mapperFacade.map(userRegistrationDTO, User.class);
    }
}
