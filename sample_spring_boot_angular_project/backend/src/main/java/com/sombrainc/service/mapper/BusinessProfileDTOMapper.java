package com.sombrainc.service.mapper;

import com.sombrainc.dto.BusinessProfileDTO;
import com.sombrainc.entity.BusinessProfile;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum BusinessProfileDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    BusinessProfileDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(BusinessProfile.class, BusinessProfileDTO.class)
            .byDefault()
            .field("address", "locationDTO.address")
            .customize(new CustomMapper<BusinessProfile, BusinessProfileDTO>() {
                @Override
                public void mapAtoB(BusinessProfile businessProfile, BusinessProfileDTO businessProfileDTO, MappingContext context) {
                    businessProfileDTO.getLocationDTO().setLat(businessProfile.getLatitude().toString());
                    businessProfileDTO.getLocationDTO().setLng(businessProfile.getLongitude().toString());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public BusinessProfileDTO map(BusinessProfile businessProfile) {
        return this.mapperFacade.map(businessProfile, BusinessProfileDTO.class);
    }

}
