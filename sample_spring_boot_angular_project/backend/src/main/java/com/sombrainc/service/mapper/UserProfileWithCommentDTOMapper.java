package com.sombrainc.service.mapper;

import com.sombrainc.dto.FileDetailsDTO;
import com.sombrainc.dto.profile.UserProfileWithCommentDTO;
import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum UserProfileWithCommentDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    UserProfileWithCommentDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(UserProfile.class, UserProfileWithCommentDTO.class)
            .byDefault()
            .field("address", "locationDTO.address")
            .field("latitude", "locationDTO.lat")
            .field("longitude", "locationDTO.lng")
            .customize(new CustomMapper<UserProfile, UserProfileWithCommentDTO>() {
                @Override
                public void mapAtoB(UserProfile userProfile, UserProfileWithCommentDTO userProfileWithCommentDTO, MappingContext context) {
                    userProfileWithCommentDTO.setProfilePhoto(FileDetailsDTO
                        .builder()
                        .fullName(userProfile.getUsers().getImage() == null ? "fullName" : userProfile.getUsers().getImage().getFullName())
                        .originalName(userProfile.getUsers().getImage() == null ? "originalName" : userProfile
                            .getUsers()
                            .getImage()
                            .getOriginalName())
                        .url(userProfile.getUsers().getImage() == null ? "url" : userProfile.getUsers().getImage().getUrl())
                        .size200(userProfile.getUsers().getImage() == null ? "url" : userProfile.getUsers().getImage().getSize200())
                        .build());
                    userProfileWithCommentDTO.setCertificate(FileUtil.getFileDetailsFromURL(userProfile.getCertificate()));
                    userProfileWithCommentDTO.setImages(FileUtil.getFileDetailsList(userProfile.getImages()));
                    userProfileWithCommentDTO.setRoles(WorkerRole.of(userProfile.getWorkerRoles()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public UserProfileWithCommentDTO map(UserProfile userProfile) {
        return this.mapperFacade.map(userProfile, UserProfileWithCommentDTO.class);
    }

}
