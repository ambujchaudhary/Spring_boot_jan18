package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.JobModalForFeedbackDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.PaymentUtil;
import com.sombrainc.util.UserUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum JobModalForFeedbackDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    JobModalForFeedbackDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Job.class, JobModalForFeedbackDTO.class)
            .byDefault()
            .customize(new CustomMapper<Job, JobModalForFeedbackDTO>() {
                @Override
                public void mapAtoB(Job job, JobModalForFeedbackDTO jobModalForFeedbackDTO, MappingContext context) {
                    if (job.getOwnerType().equals(JobOwner.PERSONAL_NAME)) {
                        jobModalForFeedbackDTO.setFullName(UserUtil.getFullName(job.getOwner()));
                    } else {
                        jobModalForFeedbackDTO.setFullName(job.getOwner().getBusinessProfile().getBusinessName());
                    }
                    jobModalForFeedbackDTO.setAmount(PaymentUtil.getAmount(job));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public JobModalForFeedbackDTO map(Job job) {
        return this.mapperFacade.map(job, JobModalForFeedbackDTO.class);
    }

}
