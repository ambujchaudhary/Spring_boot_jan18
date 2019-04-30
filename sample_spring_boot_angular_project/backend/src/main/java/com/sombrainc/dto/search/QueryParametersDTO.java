package com.sombrainc.dto.search;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class QueryParametersDTO {

    private BigDecimal latitude;

    private BigDecimal longitude;

    private int radius;

    private LocalDate dateFrom;

    private LocalDate dateTo;

    private BigDecimal amountFrom;

    private BigDecimal amountTo;

    private BigDecimal hourFrom;

    private BigDecimal hourTo;

    private List<String> jobType;

    public static QueryParametersDTO of(SearchRequestDTO requestParams) {
        QueryParametersDTO q = new QueryParametersDTO();
        if (requestParams.getLat() != null) {
            q.setLatitude(new BigDecimal(requestParams.getLat()));
        }
        if (requestParams.getLng() != null) {
            q.setLongitude(new BigDecimal(requestParams.getLng()));
        }
        if (requestParams.getRadius() != null) {
            q.setRadius(Integer.parseInt(requestParams.getRadius()));
        }
        if (requestParams.getDateFrom() != null) {
            q.setDateFrom(LocalDate.parse(requestParams.getDateFrom()));
        }
        if (requestParams.getDateTo() != null) {
            q.setDateTo(LocalDate.parse(requestParams.getDateTo()));
        }
        if (requestParams.getAmountFrom() != null) {
            q.setAmountFrom(new BigDecimal(requestParams.getAmountFrom()));
        }
        if (requestParams.getAmountTo() != null) {
            q.setAmountTo(new BigDecimal(requestParams.getAmountTo()));
        }
        if (requestParams.getHourFrom() != null) {
            q.setHourFrom(new BigDecimal(requestParams.getHourFrom()));
        }
        if (requestParams.getHourTo() != null) {
            q.setHourTo(new BigDecimal(requestParams.getHourTo()));
        }
        q.setJobType(requestParams.getJobType());
        return q;
    }
}
