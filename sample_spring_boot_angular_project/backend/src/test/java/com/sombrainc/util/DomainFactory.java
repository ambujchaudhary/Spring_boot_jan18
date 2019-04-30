package com.sombrainc.util;

import com.sombrainc.dto.*;
import com.sombrainc.dto.job.JobDTO;
import com.sombrainc.dto.profile.UserProfileDTO;
import com.sombrainc.entity.*;
import com.sombrainc.entity.enumeration.Experience;
import com.sombrainc.entity.enumeration.JobStatus;
import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.entity.enumeration.WorkerRole;
import org.apache.commons.lang.StringUtils;

import java.math.BigDecimal;
import java.util.Collections;
import java.util.List;

public final class DomainFactory {

    private DomainFactory() {
    }

    public static UserRegistrationDTO createUserRegistrationDTO() {
        return UserRegistrationDTO.builder().email(StringUtils.EMPTY).password("testPass").confirmPassword("testPass").build();
    }

    public static UserRegistrationDTO createUserRegistrationDTOWithIncorrectPassword() {
        return UserRegistrationDTO.builder().password("testPass").build();
    }

    public static UserProfileDTO createUserProfileDTO() {
        return UserProfileDTO
            .builder()
            .locationDTO(createLocationDto())
            .profilePhoto(StringUtils.EMPTY)
            .publicBio(StringUtils.EMPTY)
            .experience(Experience.MASTER)
            .roles(Collections.singletonList(WorkerRole.ASSISTANT))
            .build();
    }

    public static UserProfile createUserProfile() {
        return UserProfile
            .builder()
            .experience(Experience.ADVANCE)
            .workerRoles(Collections.EMPTY_LIST)
            .images(Collections.EMPTY_LIST)
            .users(createDefaultCurrentUser())
            .build();
    }

    private static BusinessProfile createDefaultBusinessProfile() {
        return BusinessProfile.builder().address(StringUtils.EMPTY).latitude(BigDecimal.TEN).longitude(BigDecimal.TEN).build();
    }

    public static BusinessProfileDTO createBusinessProfileDTO() {
        return BusinessProfileDTO.builder().locationDTO(createLocationDto()).build();
    }

    public static User createDefaultCurrentUser() {
        return User
            .builder()
            .id(1L)
            .userProfile(UserProfile.builder().users(new User()).build())
            .businessProfile(createDefaultBusinessProfile())
            .status(UserStatus.VERIFICATION_SUCCESS)
            .build();
    }

//    public static User createUserWithCommentProfile() {
//        return User.builder().userProfile(createUserProfileComment()).build();
//    }

    public static User createUserWithProfile() {
        return User.builder().userProfile(createUserProfile()).build();
    }

    public static User createUserWithStatusPending() {
        return User.builder().status(UserStatus.PENDING).userProfile(UserProfile.builder().users(new User()).build()).build();
    }

    public static JobDTO createJobDTO() {
        return JobDTO
            .builder()
            .workerRoles(List.of(WorkerRole.ASSISTANT.name()))
            .pricePerHour("10")
            .numberOfHour("10")
            .locationDTO(createLocationDto())
            .build();
    }

    private static LocationDTO createLocationDto() {
        return LocationDTO.builder().lat("1").lng("1").address("address").build();
    }

    public static Job createJob() {
        return Job
            .builder()
            .address("address")
            .longitude(BigDecimal.TEN)
            .latitude(BigDecimal.TEN)
            .pricePerHour(BigDecimal.TEN)
            .numberOfHours(BigDecimal.TEN)
            .jobStatus(JobStatus.NEW)
            .attachment(Collections.EMPTY_LIST)
            .owner(createUserWithSubscription())
            .jobApplicants(List.of(new JobApplicant()))
            .build();
    }

    public static Job createOwnerJob() {
        return Job.builder().jobStatus(JobStatus.NEW).owner(createDefaultCurrentUser()).build();
    }

    public static Subscription createSubscription() {
        return Subscription.builder().build();
    }

    public static User createUserWithSubscription() {
//        return User.builder().subscription(createSubscription()).build();
        return null;
    }

    public static LoginUserDTO createLoginUserDTO() {
        return LoginUserDTO.builder().email(StringUtils.EMPTY).build();
    }

    public static ForgotPasswordDTO createForgotPasswordDTO() {
        return ForgotPasswordDTO.builder().email(StringUtils.EMPTY).build();
    }

    public static RestorePasswordDTO createRestorePasswordDTO() {
        return RestorePasswordDTO.builder().password(StringUtils.EMPTY).token(StringUtils.EMPTY).build();
    }

}
