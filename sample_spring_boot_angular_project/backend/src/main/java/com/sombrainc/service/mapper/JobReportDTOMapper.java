package com.sombrainc.service.mapper;

import com.sombrainc.dto.report.JobReportDTO;
import com.sombrainc.entity.Job;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.util.BaseMapper;
import com.sombrainc.util.PaymentUtil;
import com.sombrainc.util.UserUtil;
import ma.glasnost.orika.CustomMapper;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MappingContext;
import org.apache.commons.lang.StringUtils;

public enum JobReportDTOMapper {

    INSTANCE;

    private final MapperFacade mapperFacade;

    private static final String HIRED = "H";

    private static final String CANCELLED = "C";

    JobReportDTOMapper() {
        BaseMapper.MAPPER_FACTORY.classMap(Job.class, JobReportDTO.class).customize(new CustomMapper<Job, JobReportDTO>() {
            @Override
            public void mapAtoB(Job job, JobReportDTO jobReportDTO, MappingContext context) {
                jobReportDTO.setLatitude(job.getLatitude());
                jobReportDTO.setLongitude(job.getLongitude());
                jobReportDTO.setPostedBy(UserUtil.getFullName(job.getOwner()));
                jobReportDTO.setJobTitle(job.getTitle());
                jobReportDTO.setDollarValue(PaymentUtil.getAmount(job));
                jobReportDTO.setCreatedDate(job.getCreatedAt().toLocalDate().toString());
                jobReportDTO.setJobDate(job.getDate().toString());
                if (job.getJobStatus() == JobStatus.OFFER_ACCEPTED || job.getJobStatus() == JobStatus.IN_PROGRESS
                    || job.getJobStatus() == JobStatus.DONE || job.getJobStatus() == JobStatus.COMPLETED) {
                    jobReportDTO.setStatus(HIRED);
                    jobReportDTO.setDateClosed(job.getModifiedAt().toLocalDate().toString());
                    jobReportDTO.setShooter(UserUtil.getFullName(job.getShooter()));
                } else if (job.getJobStatus() == JobStatus.CANCELLED) {
                    jobReportDTO.setStatus(CANCELLED);
                    jobReportDTO.setDateClosed(job.getModifiedAt().toLocalDate().toString());
                } else {
                    jobReportDTO.setStatus(StringUtils.EMPTY);
                    jobReportDTO.setDateClosed(StringUtils.EMPTY);
                }
                jobReportDTO.setNumberOfApplicants(String.valueOf(job.getJobApplicants().size()));
            }
        }).register();
        mapperFacade = BaseMapper.MAPPER_FACTORY.getMapperFacade();
    }

    public JobReportDTO map(Job job) {
        return this.mapperFacade.map(job, JobReportDTO.class);
    }
}
