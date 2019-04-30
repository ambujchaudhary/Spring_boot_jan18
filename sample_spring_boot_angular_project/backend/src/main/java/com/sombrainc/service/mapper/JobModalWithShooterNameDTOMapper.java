package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.JobModalWithShooterNameDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.PaymentUtil;
import com.sombrainc.util.UserUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

public enum JobModalWithShooterNameDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    JobModalWithShooterNameDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Job.class, JobModalWithShooterNameDTO.class)
            .byDefault()
            .customize(new CustomMapper<Job, JobModalWithShooterNameDTO>() {
                @Override
                public void mapAtoB(Job job, JobModalWithShooterNameDTO jobModalWithShooterNameDTO, MappingContext context) {
                    jobModalWithShooterNameDTO.setShooterName(UserUtil.getFullName(job.getShooter()));
                    jobModalWithShooterNameDTO.setAmount(PaymentUtil.getAmount(job));
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public JobModalWithShooterNameDTO map(Job job) {
        return this.mapperFacade.map(job, JobModalWithShooterNameDTO.class);
    }

}
