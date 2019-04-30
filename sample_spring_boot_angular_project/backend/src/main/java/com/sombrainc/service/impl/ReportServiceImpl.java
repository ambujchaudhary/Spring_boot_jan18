package com.sombrainc.service.impl;

import com.sombrainc.dto.report.JobReportDTO;
import com.sombrainc.dto.report.ReportDTO;
import com.sombrainc.dto.report.ReportUrlDTO;
import com.sombrainc.entity.enumeration.ReportType;
import com.sombrainc.repository.JobApplicantRepository;
import com.sombrainc.repository.JobRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.AmazonStorageService;
import com.sombrainc.service.ReportService;
import com.sombrainc.service.mapper.JobReportDTOMapper;
import com.sombrainc.util.ReportUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static com.sombrainc.util.ReportUtil.FILENAME_TEMPLATE;

@Slf4j
@Service
public class ReportServiceImpl implements ReportService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobApplicantRepository jobApplicantRepository;

    @Autowired
    private AmazonStorageService amazonStorageService;

    private ReportDTO getDailyReport(LocalDate date) {
        int jobs = jobRepository.countJobsByDay(date.getYear(), date.getMonthValue(), date.getDayOfMonth());
        int users = userRepository.countUsersByDay(date.getYear(), date.getMonthValue(), date.getDayOfMonth());
        int jobApps = jobApplicantRepository.countJobAppsByDay(date.getYear(), date.getMonthValue(), date.getDayOfMonth());
        return ReportDTO.builder().jobs(jobs).users(users).applicants(jobApps).build();
    }

    private ReportDTO getMonthlyReport(LocalDate date) {
        int jobs = jobRepository.countJobsByMonth(date.getYear(), date.getMonthValue());
        int users = userRepository.countUsersByMonth(date.getYear(), date.getMonthValue());
        int jobApps = jobApplicantRepository.countJobAppsByMonth(date.getYear(), date.getMonthValue());
        return ReportDTO.builder().jobs(jobs).users(users).applicants(jobApps).build();
    }

    private ReportDTO getReportPerYear(LocalDate date) {
        int jobs = jobRepository.countJobsByYear(date.getYear());
        int users = userRepository.countUsersByYear(date.getYear());
        int jobApps = jobApplicantRepository.countJobAppsByYear(date.getYear());
        return ReportDTO.builder().jobs(jobs).users(users).applicants(jobApps).build();
    }

    @Override
    public ReportDTO getReport(String date, ReportType reportType) {
        LocalDate parsedDate = LocalDate.parse(date);
        switch (reportType) {
            case DAY:
                return getDailyReport(parsedDate);
            case MONTH:
                return getMonthlyReport(parsedDate);
            case YEAR:
                return getReportPerYear(parsedDate);
            default:
                throw new UnsupportedOperationException("Report type is unsupported");
        }
    }

    @Override
    public ReportUrlDTO getAllTimeReport() {
        List<JobReportDTO> reportDTOList = jobRepository
            .findAll()
            .stream()
            .map(JobReportDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
        List<JobReportDTO> realJobs = new ArrayList<>();
        for (JobReportDTO jobReportDTO : reportDTOList) {
            if (!((jobReportDTO.getLatitude().compareTo(BigDecimal.valueOf(50.45010000)) == 0) && (
                jobReportDTO.getLongitude().compareTo(BigDecimal.valueOf(30.52340000)) == 0))) {
                realJobs.add(jobReportDTO);
            }
        }
        File report = ReportUtil.generateReport(realJobs);
        String url = amazonStorageService.uploadFile(report, String.format(FILENAME_TEMPLATE, LocalDateTime.now().toString()));
        return ReportUrlDTO.of(url);
    }
}