package com.sombrainc.util;

import com.opencsv.CSVWriter;
import com.sombrainc.dto.report.JobReportDTO;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
public final class ReportUtil {

    public static final String FILENAME_TEMPLATE = "%s.csv";

    private ReportUtil() {
    }

    public static File generateReport(List<JobReportDTO> jobReportDTOList) {
        File file = new File(String.format(FILENAME_TEMPLATE, RandomUtil.generateToken()));
        try (FileWriter fileWriter = new FileWriter(file); CSVWriter csvWriter = new CSVWriter(fileWriter)) {
            List<String[]> data = new ArrayList<>();
            data.add(new String[] { "Posted by", "Job", "Dollar value", "Date created", "Date of job", "Cancelled or hired?",
                "No. of applicants", "Date closed (Cancelled or Hired)", "Successful applicant" });
            jobReportDTOList.forEach(job -> data.add(
                new String[] { job.getPostedBy(), job.getJobTitle(), job.getDollarValue(), job.getCreatedDate(), job.getJobDate(),
                    job.getStatus(), job.getNumberOfApplicants(), job.getDateClosed(), job.getShooter() }));
            csvWriter.writeAll(data);
        } catch (IOException e) {
            LOGGER.error(e.getMessage(), e);
        }
        return file;
    }
}
