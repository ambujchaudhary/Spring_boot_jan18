package com.sombrainc.dto.feedback;

import com.sombrainc.entity.Feedback;
import com.sombrainc.entity.enumeration.FeedbackType;
import com.sombrainc.entity.enumeration.JobOwner;
import com.sombrainc.util.UserUtil;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FeedbackTextDTO {

    private Long id;

    private String authorFullName;

    private String review;

    private LocalDate reviewDate;

    private int mark;

    private JobOwner ownerType;

    public static FeedbackTextDTO of(Feedback feedback) {
        FeedbackTextDTO feedbackTextDTO = new FeedbackTextDTO();
        feedbackTextDTO.setId(feedback.getId());
        feedbackTextDTO.setReview(feedback.getReview());
        feedbackTextDTO.setReviewDate(feedback.getCreatedAt().toLocalDate());
        feedbackTextDTO.setMark(feedback.getStar().getValue());
        if (feedback.getFeedbackType() == FeedbackType.AS_BUSINESS) {
            feedbackTextDTO.setOwnerType(JobOwner.PERSONAL_NAME);
            feedbackTextDTO.setAuthorFullName(UserUtil.getFullName(feedback.getAuthor()));
        } else {
            feedbackTextDTO.setOwnerType(JobOwner.BUSINESS_NAME);
            if (feedback.getJob().getOwnerType() == JobOwner.BUSINESS_NAME) {
                feedbackTextDTO.setAuthorFullName(feedback.getAuthor().getBusinessProfile().getBusinessName());
            } else {
                feedbackTextDTO.setAuthorFullName(UserUtil.getFullName(feedback.getAuthor()));
            }
        }
        return feedbackTextDTO;
    }
}
