package com.sombrainc.service.mapper;

import com.sombrainc.dto.LocationDTO;
import com.sombrainc.dto.profile.UserProfileInfoDTO;
import com.sombrainc.entity.EditedProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserProfileInfoDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserProfileInfoDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(EditedProfile.class, UserProfileInfoDTO.class)
            .byDefault()
            .customize(new CustomMapper<EditedProfile, UserProfileInfoDTO>() {
                @Override
                public void mapAtoB(EditedProfile editedProfile, UserProfileInfoDTO userProfileInfoDTO, MappingContext context) {
                    userProfileInfoDTO.setLocationDTO(new LocationDTO(editedProfile.getAddress(), editedProfile.getLongitude().toString(),
                        editedProfile.getLatitude().toString()));
                    userProfileInfoDTO.setRoles(WorkerRole.of(editedProfile.getWorkerRoles()));
                    userProfileInfoDTO.setExperience(editedProfile.getExperience().name());
                    userProfileInfoDTO.setProfilePhoto(FileUtil.getProfileImageDetailsFromURL(editedProfile.getProfilePhoto()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserProfileInfoDTO map(EditedProfile editedProfile) {
        return this.mapperFacade.map(editedProfile, UserProfileInfoDTO.class);
    }

}
