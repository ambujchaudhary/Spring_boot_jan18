package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.JobDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

import java.math.BigDecimal;

public enum JobMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    JobMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(JobDTO.class, Job.class)
            .byDefault()
            .field("locationDTO.address", "address")
            .customize(new CustomMapper<JobDTO, Job>() {
                @Override
                public void mapAtoB(JobDTO jobDTO, Job job, MappingContext context) {
                    job.setPricePerHour(new BigDecimal(jobDTO.getPricePerHour()));
                    job.setLatitude(new BigDecimal(jobDTO.getLocationDTO().getLat()));
                    job.setLongitude(new BigDecimal(jobDTO.getLocationDTO().getLng()));
                    job.setNumberOfHours(new BigDecimal(jobDTO.getNumberOfHour()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public Job map(JobDTO jobDTO) {
        return this.mapperFacade.map(jobDTO, Job.class);
    }

}
