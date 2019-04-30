package com.sombrainc.service;

import com.sombrainc.dto.report.ReportDTO;
import com.sombrainc.dto.report.ReportUrlDTO;
import com.sombrainc.entity.enumeration.ReportType;

public interface ReportService {

    ReportDTO getReport(String date, ReportType reportType);

    ReportUrlDTO getAllTimeReport();
}
