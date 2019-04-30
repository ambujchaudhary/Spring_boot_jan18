package com.sombrainc.service.mapper;

import com.sombrainc.dto.profile.UserProfileViewDTO;
import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserProfileViewDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserProfileViewDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(UserProfile.class, UserProfileViewDTO.class)
            .byDefault()
            .field("users.firstName", "firstName")
            .field("users.lastName", "lastName")
            .customize(new CustomMapper<UserProfile, UserProfileViewDTO>() {
                @Override
                public void mapAtoB(UserProfile userProfile, UserProfileViewDTO userProfileViewDTO, MappingContext context) {
                    userProfileViewDTO.setExperience(userProfile.getExperience().getYears());
                    userProfileViewDTO.setRoles(WorkerRole.of(userProfile.getWorkerRoles()));
                    userProfileViewDTO.setImages(FileUtil.getImageDetailsList(userProfile.getImages()));
                    userProfileViewDTO.setBusinessName(userProfile.getUsers().getBusinessProfile().getBusinessName());
                    userProfileViewDTO.setProfilePhoto(
                        userProfile.getUsers().getImage() == null ? "image" : userProfile.getUsers().getImage().getSize200());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserProfileViewDTO map(UserProfile userProfile) {
        return this.mapperFacade.map(userProfile, UserProfileViewDTO.class);
    }

}
