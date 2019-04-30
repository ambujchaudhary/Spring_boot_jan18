package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.JobViewDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.FileUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

import java.util.Collections;

import static com.sombrainc.entity.enumeration.OwnershipType.VIEWER;

public enum JobViewDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    JobViewDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Job.class, JobViewDTO.class)
            .byDefault()
            .field("address", "locationDTO.address")
            .customize(new CustomMapper<Job, JobViewDTO>() {
                @Override
                public void mapAtoB(Job job, JobViewDTO jobViewDTO, MappingContext context) {
                    jobViewDTO.setPricePerHour(job.getPricePerHour().toString());
                    jobViewDTO.getLocationDTO().setLat(job.getLatitude().toString());
                    jobViewDTO.getLocationDTO().setLng(job.getLongitude().toString());
                    jobViewDTO.setAttachment(FileUtil.getFileDetailsList(job.getAttachment()));
                    jobViewDTO.setNumberOfHour(job.getNumberOfHours().toString());
                    jobViewDTO.setStatus(job.getJobStatus().name());
                    jobViewDTO.setOwnerId(job.getOwner().getId().toString());
                    jobViewDTO.setOwnerProfileId(String.valueOf(job.getOwner().getUserProfile().getId()));
                    jobViewDTO.setOwnershipType(VIEWER.name());
                    jobViewDTO.setApplicants(Collections.emptyList());
                    if (job.getOwnerType().equals(JobOwner.PERSONAL_NAME)) {
                        jobViewDTO.setOwnerName(job.getOwner().getFirstName() + " " + job.getOwner().getLastName());
                    } else {
                        jobViewDTO.setOwnerName(job.getOwner().getBusinessProfile().getBusinessName());
                    }
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public JobViewDTO map(Job job) {
        return this.mapperFacade.map(job, JobViewDTO.class);
    }

}
