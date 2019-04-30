package com.sombrainc.service.mapper;

import com.sombrainc.dto.profile.ProfileImageDetailsDTO;
import com.sombrainc.entity.Image;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.MapperFacade;

public enum ProfileImageDetailsDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    ProfileImageDetailsDTOMapper() {
        BaseMapper.MAPPER_FACTORY.classMap(Image.class, ProfileImageDetailsDTO.class).byDefault().register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public ProfileImageDetailsDTO map(Image image) {
        return this.mapperFacade.map(image, ProfileImageDetailsDTO.class);
    }

}
