package com.sombrainc.service.mapper;

import com.sombrainc.dto.profile.UserProfileInfoDTO;
import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.Experience;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

import java.math.BigDecimal;

public enum UserProfileMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserProfileMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(UserProfileInfoDTO.class, UserProfile.class)
            .byDefault()
            .field("locationDTO.address", "address")
            .customize(new CustomMapper<UserProfileInfoDTO, UserProfile>() {
                @Override
                public void mapAtoB(UserProfileInfoDTO userProfileInfoDTO, UserProfile userProfile, MappingContext context) {
                    userProfile.setLatitude(new BigDecimal(userProfileInfoDTO.getLocationDTO().getLat()));
                    userProfile.setLongitude(new BigDecimal(userProfileInfoDTO.getLocationDTO().getLng()));
                    userProfile.setExperience(Experience.valueOf(userProfileInfoDTO.getExperience()));
                    userProfile.setWorkerRoles(WorkerRole.ofRoles(userProfileInfoDTO.getRoles()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserProfile map(UserProfileInfoDTO userProfileInfoDTO) {
        return this.mapperFacade.map(userProfileInfoDTO, UserProfile.class);
    }
}
