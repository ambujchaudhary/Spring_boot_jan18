package com.sombrainc.service.mapper;

import com.sombrainc.dto.profile.UserProfileDTO;
import com.sombrainc.entity.EditedProfile;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

import java.math.BigDecimal;

public enum EditedProfileMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    EditedProfileMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(UserProfileDTO.class, EditedProfile.class)
            .byDefault()
            .field("locationDTO.address", "address")
            .field("roles", "workerRoles")
            .customize(new CustomMapper<UserProfileDTO, EditedProfile>() {
                @Override
                public void mapAtoB(UserProfileDTO userProfileDTO, EditedProfile editedProfile, MappingContext context) {
                    if (userProfileDTO.getLocationDTO() != null && !userProfileDTO.getLocationDTO().getAddress().isEmpty()) {
                        editedProfile.setLatitude(new BigDecimal(userProfileDTO.getLocationDTO().getLat()));
                        editedProfile.setLongitude(new BigDecimal(userProfileDTO.getLocationDTO().getLng()));
                    }
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public EditedProfile map(UserProfileDTO userProfileDTO) {
        return this.mapperFacade.map(userProfileDTO, EditedProfile.class);
    }

}
