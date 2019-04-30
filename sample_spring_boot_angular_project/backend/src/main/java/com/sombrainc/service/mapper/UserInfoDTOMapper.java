package com.sombrainc.service.mapper;

import com.sombrainc.dto.LocationDTO;
import com.sombrainc.dto.UserInfoDTO;
import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserInfoDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserInfoDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(UserProfile.class, UserInfoDTO.class)
            .byDefault()
            .field("users.firstName", "firstName")
            .field("users.lastName", "lastName")
            .customize(new CustomMapper<UserProfile, UserInfoDTO>() {
                @Override
                public void mapAtoB(UserProfile userProfile, UserInfoDTO userInfoDTO, MappingContext context) {
                    userInfoDTO.setProfileLocation(new LocationDTO(userProfile.getAddress(), userProfile.getLongitude().toString(),
                        userProfile.getLatitude().toString()));
                    userInfoDTO.setExperience(userProfile.getExperience().name());
                    userInfoDTO.setRoles(WorkerRole.of(userProfile.getWorkerRoles()));
                    userInfoDTO.setImages(FileUtil.getImageDetailsList(userProfile.getImages()));
                    userInfoDTO.setBusinessName(userProfile.getUsers().getBusinessProfile().getBusinessName());
                    userInfoDTO.setProfilePhoto(FileUtil.getProfileImageDetailsFromURL(userProfile.getUsers().getImage().getUrl()));
                    userInfoDTO.setCertificate(FileUtil.getFileDetailsFromURL(userProfile.getCertificate()));
                    userInfoDTO.setWebAddress(userProfile.getUsers().getBusinessProfile().getWebAddress());
                    userInfoDTO.setAbn(userProfile.getUsers().getBusinessProfile().getABN());
                    userInfoDTO.setGst(userProfile.getUsers().getBusinessProfile().getGST());
                    userInfoDTO.setBusinessLocation(new LocationDTO(userProfile.getUsers().getBusinessProfile().getAddress(),
                        userProfile.getUsers().getBusinessProfile().getLongitude().toString(),
                        userProfile.getUsers().getBusinessProfile().getLatitude().toString()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserInfoDTO map(UserProfile userProfile) {
        return this.mapperFacade.map(userProfile, UserInfoDTO.class);

    }
}
