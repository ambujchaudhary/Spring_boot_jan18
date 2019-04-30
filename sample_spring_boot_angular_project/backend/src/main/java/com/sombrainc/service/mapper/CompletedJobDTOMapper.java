package com.sombrainc.service.mapper;

import com.sombrainc.dto.job.CompletedJobDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.UserUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;

import java.math.RoundingMode;

public enum CompletedJobDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    CompletedJobDTOMapper() {
        BaseMapper.MAPPER_FACTORY
            .classMap(Job.class, CompletedJobDTO.class)
            .byDefault()
            .customize(new CustomMapper<Job, CompletedJobDTO>() {
                @Override
                public void mapAtoB(Job job, CompletedJobDTO completedJobDTO, MappingContext context) {
                    completedJobDTO.setOwnerFullName(UserUtil.getFullName(job.getOwner()));
                    completedJobDTO.setOwnerId(job.getOwner().getId());
                    if (job.getShooter() != null) {
                        completedJobDTO.setShooterFullName(UserUtil.getFullName(job.getShooter()));
                        completedJobDTO.setShooterId(job.getShooter().getId());
                    }
                    completedJobDTO.setAmount(
                        job.getPricePerHour().multiply(job.getNumberOfHours()).setScale(2, RoundingMode.HALF_EVEN).toString());
                }
            })
            .register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public CompletedJobDTO map(Job job) {
        return this.mapperFacade.map(job, CompletedJobDTO.class);
    }
}
