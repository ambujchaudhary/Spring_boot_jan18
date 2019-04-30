package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.JobBasicInfoDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.MapperFacade;

public enum JobBasicInfoDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    JobBasicInfoDTOMapper() {
        BaseMapper.MAPPER_FACTORY.classMap(Job.class, JobBasicInfoDTO.class).byDefault().register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public JobBasicInfoDTO map(Job job) {
        return this.mapperFacade.map(job, JobBasicInfoDTO.class);
    }

}
