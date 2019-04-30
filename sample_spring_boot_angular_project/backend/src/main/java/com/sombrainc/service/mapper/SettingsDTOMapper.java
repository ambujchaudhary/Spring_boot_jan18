package com.sombrainc.service.mapper;

import com.sombrainc.dto.SettingsDTO;
import com.sombrainc.entity.Settings;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum SettingsDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    SettingsDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Settings.class, SettingsDTO.class)
            .byDefault()
            .customize(new CustomMapper<Settings, SettingsDTO>() {
                @Override
                public void mapAtoB(Settings settings, SettingsDTO settingsDTO, MappingContext context) {
                    settingsDTO.setRadius(String.valueOf(settings.getRadius()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public SettingsDTO map(Settings settings) {
        return this.mapperFacade.map(settings, SettingsDTO.class);
    }

}
