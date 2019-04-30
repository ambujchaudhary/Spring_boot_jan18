package com.sombrainc.controller;

import com.sombrainc.dto.report.ReportDTO;
import com.sombrainc.dto.report.ReportUrlDTO;
import com.sombrainc.entity.enumeration.ReportType;
import com.sombrainc.service.ReportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ReportController {

    @Autowired
    private ReportService reportService;

    @GetMapping("/api/private/report")
    public ReportDTO getReport(@RequestParam(value = "date") String date, @RequestParam(value = "type") ReportType reportType) {
        return reportService.getReport(date, reportType);
    }

    @GetMapping("/api/private/report/download")
    public ReportUrlDTO downloadReport() {
        return reportService.getAllTimeReport();
    }
}
