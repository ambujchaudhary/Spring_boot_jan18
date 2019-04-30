package com.sombrainc.service.mapper;

import com.sombrainc.dto.profile.UserProfileWithCommentDTO;
import com.sombrainc.entity.EditedProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserEditedProfileWithCommentDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserEditedProfileWithCommentDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(EditedProfile.class, UserProfileWithCommentDTO.class)
            .byDefault()
            .field("address", "locationDTO.address")
            .field("latitude", "locationDTO.lat")
            .field("longitude", "locationDTO.lng")
            .customize(new CustomMapper<EditedProfile, UserProfileWithCommentDTO>() {
                @Override
                public void mapAtoB(EditedProfile editedProfile, UserProfileWithCommentDTO userProfileWithCommentDTO,
                    MappingContext context) {
                    userProfileWithCommentDTO.setProfilePhoto(FileUtil.getFileDetailsFromURL(editedProfile.getProfilePhoto()));
                    userProfileWithCommentDTO.setCertificate(FileUtil.getFileDetailsFromURL(editedProfile.getCertificate()));
                    userProfileWithCommentDTO.setImages(FileUtil.getFileDetailsList(editedProfile.getImages()));
                    userProfileWithCommentDTO.setRoles(WorkerRole.of(editedProfile.getWorkerRoles()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserProfileWithCommentDTO map(EditedProfile editedProfile) {
        return this.mapperFacade.map(editedProfile, UserProfileWithCommentDTO.class);
    }

}
