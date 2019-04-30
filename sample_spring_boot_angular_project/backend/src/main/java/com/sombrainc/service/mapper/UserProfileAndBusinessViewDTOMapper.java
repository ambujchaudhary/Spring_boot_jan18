package com.sombrainc.service.mapper;

import com.sombrainc.dto.UserProfileAndBusinessViewDTO;
import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserProfileAndBusinessViewDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserProfileAndBusinessViewDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(UserProfile.class, UserProfileAndBusinessViewDTO.class)
            .byDefault()
            .field("users.firstName", "firstName")
            .field("users.lastName", "lastName")
            .customize(new CustomMapper<UserProfile, UserProfileAndBusinessViewDTO>() {
                @Override
                public void mapAtoB(UserProfile userProfile, UserProfileAndBusinessViewDTO userProfileAndBusinessViewDTO,
                    MappingContext context) {
                    userProfileAndBusinessViewDTO.setExperience(userProfile.getExperience().getYears());
                    userProfileAndBusinessViewDTO.setRoles(WorkerRole.of(userProfile.getWorkerRoles()));
                    userProfileAndBusinessViewDTO.setImages(FileUtil.getImageDetailsList(userProfile.getImages()));
                    userProfileAndBusinessViewDTO.setBusinessName(userProfile.getUsers().getBusinessProfile().getBusinessName());
                    userProfileAndBusinessViewDTO.setProfilePhoto(
                        userProfile.getUsers().getImage() == null ? "image" : userProfile.getUsers().getImage().getSize200());
                    userProfileAndBusinessViewDTO.setWebAddress(userProfile.getUsers().getBusinessProfile().getWebAddress());
                    userProfileAndBusinessViewDTO.setABN(userProfile.getUsers().getBusinessProfile().getABN());
                    userProfileAndBusinessViewDTO.setGST(userProfile.getUsers().getBusinessProfile().getGST());
                    userProfileAndBusinessViewDTO.setBusinessAddress(userProfile.getUsers().getBusinessProfile().getAddress());
                    userProfileAndBusinessViewDTO.setStatus(userProfile.getUsers().getStatus().toString());
                    userProfileAndBusinessViewDTO.setBlocked(userProfile.getUsers().isBlocked());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserProfileAndBusinessViewDTO map(UserProfile userProfile) {
        return this.mapperFacade.map(userProfile, UserProfileAndBusinessViewDTO.class);
    }

}
