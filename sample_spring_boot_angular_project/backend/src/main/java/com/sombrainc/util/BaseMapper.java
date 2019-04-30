package com.sombrainc.util;

import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.DefaultMapperFactory;

public final class BaseMapper {

    private BaseMapper() {
    }

    public static final MapperFactory MAPPER_FACTORY = new DefaultMapperFactory.Builder().build();

}
