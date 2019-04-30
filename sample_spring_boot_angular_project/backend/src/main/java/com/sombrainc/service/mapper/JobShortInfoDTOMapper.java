package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.JobShortInfoDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.entity.enumeration.OwnershipType;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.UserUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum JobShortInfoDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    JobShortInfoDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Job.class, JobShortInfoDTO.class)
            .byDefault()
            .customize(new CustomMapper<Job, JobShortInfoDTO>() {
                @Override
                public void mapAtoB(Job job, JobShortInfoDTO jobShortInfoDTO, MappingContext context) {
                    jobShortInfoDTO.setPricePerHour(job.getPricePerHour().toString());
                    jobShortInfoDTO.setNumberOfHour(job.getNumberOfHours().toString());
                    jobShortInfoDTO.setApplicants(String.valueOf(job.getJobApplicants().size()));
                    jobShortInfoDTO.setStatus(job.getJobStatus().name());
                    if (job.getOwnerType().equals(JobOwner.PERSONAL_NAME)) {
                        jobShortInfoDTO.setOwnerType(UserUtil.getFullName(job.getOwner()));
                    } else {
                        jobShortInfoDTO.setOwnerType(job.getOwner().getBusinessProfile().getBusinessName());
                    }
                    jobShortInfoDTO.setOwnershipType(OwnershipType.VIEWER.name());
                    jobShortInfoDTO.setOwnerId(String.valueOf(job.getOwner().getId()));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public JobShortInfoDTO map(Job job) {
        return this.mapperFacade.map(job, JobShortInfoDTO.class);
    }

}
