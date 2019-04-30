package com.sombrainc.service.mapper;

import com.sombrainc.dto.UserProfileAndBusinessViewDTO;
import com.sombrainc.entity.EditedProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum EditedProfileAndBusinessViewDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    EditedProfileAndBusinessViewDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(EditedProfile.class, UserProfileAndBusinessViewDTO.class)
            .byDefault()
            .field("users.firstName", "firstName")
            .field("users.lastName", "lastName")
            .customize(new CustomMapper<EditedProfile, UserProfileAndBusinessViewDTO>() {
                @Override
                public void mapAtoB(EditedProfile editedProfile, UserProfileAndBusinessViewDTO userProfileAndBusinessViewDTO,
                    MappingContext context) {
                    userProfileAndBusinessViewDTO.setExperience(editedProfile.getExperience().getYears());
                    userProfileAndBusinessViewDTO.setRoles(WorkerRole.of(editedProfile.getWorkerRoles()));
                    userProfileAndBusinessViewDTO.setImages(FileUtil.getImageDetailsList(editedProfile.getImages()));
                    userProfileAndBusinessViewDTO.setBusinessName(editedProfile.getUsers().getBusinessProfile().getBusinessName());
                    userProfileAndBusinessViewDTO.setProfilePhoto(FileUtil.getProfileImageDetailsFromURL(editedProfile.getProfilePhoto()).getSize200());
                    userProfileAndBusinessViewDTO.setWebAddress(editedProfile.getUsers().getBusinessProfile().getWebAddress());
                    userProfileAndBusinessViewDTO.setABN(editedProfile.getUsers().getBusinessProfile().getABN());
                    userProfileAndBusinessViewDTO.setGST(editedProfile.getUsers().getBusinessProfile().getGST());
                    userProfileAndBusinessViewDTO.setBusinessAddress(editedProfile.getUsers().getBusinessProfile().getAddress());
                    userProfileAndBusinessViewDTO.setStatus(editedProfile.getUsers().getStatus().toString());
                    userProfileAndBusinessViewDTO.setBlocked(editedProfile.getUsers().isBlocked());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserProfileAndBusinessViewDTO map(EditedProfile editedProfile) {
        return this.mapperFacade.map(editedProfile, UserProfileAndBusinessViewDTO.class);
    }

}
