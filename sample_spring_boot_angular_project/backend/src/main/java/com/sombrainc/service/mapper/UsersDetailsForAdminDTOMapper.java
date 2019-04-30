package com.sombrainc.service.mapper;

import com.sombrainc.dto.UsersDetailsForAdminDTO;
import com.sombrainc.entity.User;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.UserUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UsersDetailsForAdminDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UsersDetailsForAdminDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(User.class, UsersDetailsForAdminDTO.class)
            .byDefault()
            .customize(new CustomMapper<User, UsersDetailsForAdminDTO>() {
                @Override
                public void mapAtoB(User user, UsersDetailsForAdminDTO usersDetailsForAdminDTO, MappingContext context) {
                    usersDetailsForAdminDTO.setId(user.getId());
                    usersDetailsForAdminDTO.setFullName(UserUtil.getFullName(user));
                    usersDetailsForAdminDTO.setJoined(user.getStartDate());
                    if (user.getEditedProfile() != null) {
                        usersDetailsForAdminDTO.setRoles(user.getEditedProfile().getWorkerRoles());
                        usersDetailsForAdminDTO.setAddress(user.getEditedProfile().getAddress());
                    } else if (user.getUserProfile() != null) {
                        usersDetailsForAdminDTO.setRoles(user.getUserProfile().getWorkerRoles());
                        usersDetailsForAdminDTO.setAddress(user.getUserProfile().getAddress());
                    }
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UsersDetailsForAdminDTO map(User user) {
        return this.mapperFacade.map(user, UsersDetailsForAdminDTO.class);
    }
}
