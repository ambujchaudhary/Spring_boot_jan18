package com.sombrainc.service.mapper;

import com.sombrainc.dto.LocationDTO;
import com.sombrainc.dto.UserInfoDTO;
import com.sombrainc.entity.EditedProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserEditedInfoDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserEditedInfoDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(EditedProfile.class, UserInfoDTO.class)
            .byDefault()
            .field("users.firstName", "firstName")
            .field("users.lastName", "lastName")
            .customize(new CustomMapper<EditedProfile, UserInfoDTO>() {
                @Override
                public void mapAtoB(EditedProfile editedProfile, UserInfoDTO userInfoDTO,
                    MappingContext context) {
                    userInfoDTO.setProfileLocation(
                        new LocationDTO(editedProfile.getAddress(), editedProfile.getLongitude().toString(),
                            editedProfile.getLatitude().toString()));
                    userInfoDTO.setExperience(editedProfile.getExperience().name());
                    userInfoDTO.setRoles(WorkerRole.of(editedProfile.getWorkerRoles()));
                    userInfoDTO.setImages(FileUtil.getImageDetailsList(editedProfile.getImages()));
                    userInfoDTO.setBusinessName(editedProfile.getUsers().getBusinessProfile().getBusinessName());
                    userInfoDTO.setProfilePhoto(FileUtil.getProfileImageDetailsFromURL(editedProfile.getProfilePhoto()));
                    userInfoDTO.setWebAddress(editedProfile.getUsers().getBusinessProfile().getWebAddress());
                    userInfoDTO.setAbn(editedProfile.getUsers().getBusinessProfile().getABN());
                    userInfoDTO.setGst(editedProfile.getUsers().getBusinessProfile().getGST());
                    userInfoDTO.setCertificate(FileUtil.getFileDetailsFromURL(editedProfile.getCertificate()));
                    userInfoDTO.setBusinessLocation(
                        new LocationDTO(editedProfile.getUsers().getBusinessProfile().getAddress(),
                            editedProfile.getUsers().getBusinessProfile().getLongitude().toString(),
                            editedProfile.getUsers().getBusinessProfile().getLatitude().toString()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserInfoDTO map(EditedProfile editedProfile) {
        return this.mapperFacade.map(editedProfile, UserInfoDTO.class);
    }

}
