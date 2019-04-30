package com.sombrainc.service.mapper;

import com.sombrainc.dto.AuthUserDTO;
import com.sombrainc.entity.User;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum AuthUserDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    AuthUserDTOMapper() {
        BaseMapper.MAPPER_FACTORY.classMap(User.class, AuthUserDTO.class).byDefault().customize(new CustomMapper<User, AuthUserDTO>() {
            @Override
            public void mapAtoB(User user, AuthUserDTO authUserDTO, MappingContext context) {
                authUserDTO.setLogo(user.getImage() == null ? null : user.getImage().getLogo());
                authUserDTO.setAddress(user.getUserProfile() == null ? "no address" : user.getUserProfile().getAddress());
                if (user.getSocialId() != null) {
                    authUserDTO.setSocial(true);
                }
            }
        }).register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public AuthUserDTO map(User user) {
        return this.mapperFacade.map(user, AuthUserDTO.class);
    }

}
