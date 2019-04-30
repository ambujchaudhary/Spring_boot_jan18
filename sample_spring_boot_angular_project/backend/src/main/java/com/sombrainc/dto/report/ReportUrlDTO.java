package com.sombrainc.dto.report;

import lombok.Data;

@Data
public class ReportUrlDTO {

    private String url;

    private ReportUrlDTO(String url) {
        this.url = url;
    }

    public static ReportUrlDTO of(String url) {
        return new ReportUrlDTO(url);
    }
}
