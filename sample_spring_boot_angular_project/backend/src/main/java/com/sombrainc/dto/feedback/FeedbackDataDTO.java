package com.sombrainc.dto.feedback;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackDataDTO {

    private BigDecimal average;

    private int quantity;

    public static FeedbackDataDTO of(BigDecimal average, int quantity) {
        return new FeedbackDataDTO(average, quantity);
    }
}
