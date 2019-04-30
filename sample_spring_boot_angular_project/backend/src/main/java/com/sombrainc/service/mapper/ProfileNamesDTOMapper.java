package com.sombrainc.service.mapper;

import com.sombrainc.dto.ProfileNamesDTO;
import com.sombrainc.entity.User;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum ProfileNamesDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    ProfileNamesDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(User.class, ProfileNamesDTO.class)
            .byDefault()
            .field("businessProfile.businessName", "businessName")
            .customize(new CustomMapper<User, ProfileNamesDTO>() {
                @Override
                public void mapAtoB(User user, ProfileNamesDTO profileNamesDTO, MappingContext context) {
                    profileNamesDTO.setUserName(user.getFirstName() + " " + user.getLastName());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public ProfileNamesDTO map(User user) {
        return this.mapperFacade.map(user, ProfileNamesDTO.class);
    }

}
