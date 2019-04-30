package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.ApplicantDTO;
import com.sombrainc.entity.JobApplicant;
import com.sombrainc.util.BaseMapper;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum ApplicantDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    ApplicantDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(JobApplicant.class, ApplicantDTO.class)
            .byDefault()
            .customize(new CustomMapper<JobApplicant, ApplicantDTO>() {
                @Override
                public void mapAtoB(JobApplicant jobApplicant, ApplicantDTO applicantDTO, MappingContext context) {
                    applicantDTO.setId(jobApplicant.getApplicant().getId());
                    applicantDTO.setProfileId(jobApplicant.getApplicant().getUserProfile().getId());
                    applicantDTO.setFirstName(jobApplicant.getApplicant().getFirstName());
                    applicantDTO.setLastName(jobApplicant.getApplicant().getLastName());
                    applicantDTO.setDate(jobApplicant.getDate());
                    if (jobApplicant.getApplicant().equals(jobApplicant.getJob().getShooter())) {
                        applicantDTO.setHired(true);
                    }
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public ApplicantDTO map(JobApplicant jobApplicant) {
        return this.mapperFacade.map(jobApplicant, ApplicantDTO.class);
    }

}
