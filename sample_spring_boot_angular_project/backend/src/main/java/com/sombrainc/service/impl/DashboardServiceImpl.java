package com.sombrainc.service.impl;

import com.sombrainc.dto.JobStatisticDTO;
import com.sombrainc.service.DashboardService;
import com.sombrainc.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class DashboardServiceImpl implements DashboardService {

    @Autowired
    private JobService jobService;

    @Override
    public JobStatisticDTO getDashboardData() {
        return jobService.getJobsStatistic();
    }
}
