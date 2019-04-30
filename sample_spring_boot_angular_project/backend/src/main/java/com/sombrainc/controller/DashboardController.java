package com.sombrainc.controller;

import com.sombrainc.dto.JobStatisticDTO;
import com.sombrainc.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class DashboardController {

    @Autowired
    private DashboardService dashboardService;

    @GetMapping("/api/protected/statistics")
    public JobStatisticDTO getDashboardData() {
        return dashboardService.getDashboardData();
    }
}
