package com.sombrainc.service.impl;

import com.sombrainc.dto.*;
import com.sombrainc.dto.feedback.FeedbackDataDTO;
import com.sombrainc.dto.profile.*;
import com.sombrainc.entity.EditedProfile;
import com.sombrainc.entity.User;
import com.sombrainc.entity.UserProfile;
import com.sombrainc.entity.enumeration.Experience;
import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.entity.enumeration.WorkerRole;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.EditedProfileRepository;
import com.sombrainc.repository.UserProfileRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.*;
import com.sombrainc.service.mapper.*;
import com.sombrainc.util.TimezoneMapper;
import com.sombrainc.util.VideoURLChecker;
import com.sombrainc.util.validator.Validator;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class UserProfileServiceImpl implements UserProfileService {

    private static final String USER_NOT_FOUND = "User not found";

    private static final String PROFILE_NOT_FOUND = "User doesn't have profile";

    @Value("${google.maps.key}")
    private String googleMapsKey;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private ImageService imageService;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private FeedbackService feedbackService;

    @Autowired
    private EditedProfileRepository editedProfileRepository;

    @Autowired
    private BusinessProfileService businessProfileService;

    @Autowired
    private AmazonStorageService amazonStorageService;

    @Override
    @Transactional
    public RestMessageDTO saveProfile(UserProfileDTO userProfileDTO) {
        LOGGER.info("Saving user profile: {}", userProfileDTO);
        User user = userService.getCurrentUser();
        if (user.getUserProfile() != null) {
            throw new BadRequest400Exception("user_profile.user_already_exist");
        }
        validationForUserProfile(userProfileDTO);
        EditedProfile editedProfile;
        if (user.getEditedProfile() != null) {
            editedProfile = user.getEditedProfile();
            editedProfile = editEditedProfile(editedProfile, userProfileDTO);
        } else {
            editedProfile = EditedProfileMapper.INSTANCE.map(userProfileDTO);
            editedProfile.setUsers(user);
        }
        addDroneOperatorRole(editedProfile);
        editedProfile.setTimezone(getTimezone(editedProfile.getLongitude(), editedProfile.getLatitude()));
        imageService.deleteUnneededImages(userProfileDTO);
        editedProfileRepository.save(editedProfile);
        imageService.deleteTemporalImages();
        emailService.sendNotificationEmailToAdmin();
        userService.changeUserStatus(user, UserStatus.PENDING);
        LOGGER.info("Profile of user: {} successfully saved and sent for approval", user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Profile sent for approval");
    }

    private String getTimezone(BigDecimal longitude, BigDecimal latitude) {
        return TimezoneMapper.getTimeZone(latitude.doubleValue(), longitude.doubleValue());
    }

    @Override
    @Transactional
    public RestMessageDTO saveForLater(UserProfileDTO userProfileDTO) {
        LOGGER.info("Saving user profile for later: {}", userProfileDTO);
        User user = userService.getCurrentUser();
        if (user.getUserProfile() != null) {
            throw new BadRequest400Exception("user_profile.user_already_exist");
        }
        EditedProfile editedProfile;
        if (user.getEditedProfile() != null) {
            editedProfile = user.getEditedProfile();
            editedProfile = editLaterProfile(editedProfile, userProfileDTO);
        } else {
            editedProfile = EditedProfileMapper.INSTANCE.map(userProfileDTO);
            editedProfile.setUsers(user);
        }
        validationForLaterProfile(userProfileDTO);
        addDroneOperatorRoleForLater(editedProfile);
        if (editedProfile.getAddress() != null && !editedProfile.getAddress().isEmpty()) {
            editedProfile.setTimezone(getTimezone(editedProfile.getLongitude(), editedProfile.getLatitude()));
        }
        imageService.deleteUnneededImages(userProfileDTO);
        editedProfileRepository.save(editedProfile);
        imageService.deleteTemporalImages();
        return RestMessageDTO.createSuccessRestMessageDTO("Profile saved for later");
    }

    @Override
    @Transactional
    public RestMessageDTO editProfile(UserProfileDTO userProfileDTO) {
        LOGGER.info("Editing user profile: {}", userProfileDTO);
        User user = userService.getCurrentUser();
        validationForUserProfile(userProfileDTO);
        EditedProfile editedProfile;
        if (user.getEditedProfile() != null) {
            editedProfile = user.getEditedProfile();
            editedProfile = editEditedProfile(editedProfile, userProfileDTO);
        } else {
            editedProfile = EditedProfileMapper.INSTANCE.map(userProfileDTO);
            editedProfile.setUsers(user);
        }
        if (editedProfile.getAdminsComment() != null) {
            editedProfile.setAdminsComment(null);
        }
        addDroneOperatorRole(editedProfile);
        editedProfile.setTimezone(getTimezone(editedProfile.getLongitude(), editedProfile.getLatitude()));
        imageService.deleteUnneededImages(userProfileDTO);
        editedProfileRepository.save(editedProfile);
        imageService.deleteTemporalImages();
        emailService.sendNotificationEmailToAdmin();
        if (user.getUserProfile() != null) {
            userService.changeUserStatus(user, UserStatus.EDITED);
        } else {
            userService.changeUserStatus(user, UserStatus.PENDING);
        }
        LOGGER.info("Profile of user: {} successfully edited and sent for approval", user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Profile sent for approval");
    }

    private EditedProfile editEditedProfile(EditedProfile editedProfile, UserProfileDTO userProfileDTO) {
        editedProfile.setCertificate(userProfileDTO.getCertificate());
        editedProfile.setPublicBio(userProfileDTO.getPublicBio());
        editedProfile.setExperience(userProfileDTO.getExperience());
        editedProfile.setEquipment(userProfileDTO.getEquipment());
        editedProfile.setResources(userProfileDTO.getResources());
        editedProfile.setImages(userProfileDTO.getImages());
        editedProfile.setVideos(userProfileDTO.getVideos());
        editedProfile.setAddress(userProfileDTO.getLocationDTO().getAddress());
        editedProfile.setWorkerRoles(userProfileDTO.getRoles());
        editedProfile.setProfilePhoto(userProfileDTO.getProfilePhoto());
        editedProfile.setLatitude(new BigDecimal(userProfileDTO.getLocationDTO().getLat()));
        editedProfile.setLongitude(new BigDecimal(userProfileDTO.getLocationDTO().getLng()));
        return editedProfile;
    }

    private EditedProfile editLaterProfile(EditedProfile editedProfile, UserProfileDTO userProfileDTO) {
        editedProfile.setCertificate(userProfileDTO.getCertificate());
        editedProfile.setPublicBio(userProfileDTO.getPublicBio());
        editedProfile.setExperience(userProfileDTO.getExperience());
        editedProfile.setEquipment(userProfileDTO.getEquipment());
        editedProfile.setResources(userProfileDTO.getResources());
        editedProfile.setImages(userProfileDTO.getImages());
        editedProfile.setVideos(userProfileDTO.getVideos());
        editedProfile.setWorkerRoles(userProfileDTO.getRoles());
        editedProfile.setProfilePhoto(userProfileDTO.getProfilePhoto());
        if (userProfileDTO.getLocationDTO() != null && !StringUtils.EMPTY.equals(userProfileDTO.getLocationDTO().getAddress())) {
            editedProfile.setAddress(userProfileDTO.getLocationDTO().getAddress());
            editedProfile.setLatitude(new BigDecimal(userProfileDTO.getLocationDTO().getLat()));
            editedProfile.setLongitude(new BigDecimal(userProfileDTO.getLocationDTO().getLng()));
        } else {
            editedProfile.setAddress(null);
            editedProfile.setLatitude(null);
            editedProfile.setLongitude(null);
        }
        return editedProfile;
    }

    private void addDroneOperatorRole(EditedProfile editedProfile) {
        if (editedProfile.getCertificate() != null) {
            if (editedProfile.getCertificate().isEmpty()) {
                throw new BadRequest400Exception("Please upload your certificate");
            } else if (!editedProfile.getWorkerRoles().contains(WorkerRole.DRONE_OPERATOR)) {
                editedProfile.getWorkerRoles().add(WorkerRole.DRONE_OPERATOR);
            }
        } else {
            editedProfile.getWorkerRoles().remove(WorkerRole.DRONE_OPERATOR);
        }
    }

    private void addDroneOperatorRoleForLater(EditedProfile editedProfile) {
        if (editedProfile.getCertificate() != null) {
            if (editedProfile.getCertificate().isEmpty()) {
                throw new BadRequest400Exception("Please upload your certificate");
            } else if (!editedProfile.getWorkerRoles().contains(WorkerRole.DRONE_OPERATOR)) {
                if (editedProfile.getWorkerRoles() != null) {
                    editedProfile.getWorkerRoles().add(WorkerRole.DRONE_OPERATOR);
                } else {
                    editedProfile.setWorkerRoles(List.of(WorkerRole.DRONE_OPERATOR));
                }
            }
        } else {
            if (editedProfile.getWorkerRoles() != null) {
                editedProfile.getWorkerRoles().remove(WorkerRole.DRONE_OPERATOR);
            } else {
                editedProfile.setWorkerRoles(null);
            }
        }
    }

    @Override
    public UserProfileWithCommentDTO getUserProfileWithComment() {
        if (userService.getCurrentUser().getEditedProfile() != null) {
            return UserEditedProfileWithCommentDTOMapper.INSTANCE.map(userService.getCurrentUser().getEditedProfile());
        } else {
            return UserProfileWithCommentDTOMapper.INSTANCE.map(userService.getCurrentUser().getUserProfile());
        }
    }

    @Override
    public UserProfileAndBusinessViewDTO getUserProfileForAdmin(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
        EditedProfile editedProfile = user.getEditedProfile();
        UserProfile userProfile = user.getUserProfile();
        UserProfileAndBusinessViewDTO userProfileAndBusinessViewDTO;
        if (editedProfile != null) {
            userProfileAndBusinessViewDTO = EditedProfileAndBusinessViewDTOMapper.INSTANCE.map(editedProfile);
            if (userProfile != null) {
                FeedbackDataDTO feedbackDataDTO = feedbackService.getFeedbackData(userProfile.getId());
                userProfileAndBusinessViewDTO.setAverageFeedback(feedbackDataDTO.getAverage());
                userProfileAndBusinessViewDTO.setFeedbackQuantity(feedbackDataDTO.getQuantity());
            }
        } else if (userProfile != null) {
            userProfileAndBusinessViewDTO = UserProfileAndBusinessViewDTOMapper.INSTANCE.map(userProfile);
            FeedbackDataDTO feedbackDataDTO = feedbackService.getFeedbackData(userProfile.getId());
            userProfileAndBusinessViewDTO.setAverageFeedback(feedbackDataDTO.getAverage());
            userProfileAndBusinessViewDTO.setFeedbackQuantity(feedbackDataDTO.getQuantity());
        } else {
            throw new BadRequest400Exception(PROFILE_NOT_FOUND);
        }
        return userProfileAndBusinessViewDTO;
    }

    @Override
    public UserInfoDTO getUserInfoForAdmin(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
        EditedProfile editedProfile = user.getEditedProfile();
        UserProfile userProfile = user.getUserProfile();
        UserInfoDTO userInfoDTO;
        if (editedProfile != null) {
            userInfoDTO = UserEditedInfoDTOMapper.INSTANCE.map(editedProfile);
        } else if (userProfile != null) {
            userInfoDTO = UserInfoDTOMapper.INSTANCE.map(userProfile);
        } else {
            throw new BadRequest400Exception(PROFILE_NOT_FOUND);
        }
        return userInfoDTO;
    }

    @Override
    public RestMessageDTO editUserInfoByAdmin(Long userId, UserShortInfoDTO userShortInfoDTO) {
        LOGGER.info("Editing user info by admin: {}", userShortInfoDTO);
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
        editUserProfileByAdmin(user.getUserProfile(), user.getEditedProfile(), userShortInfoDTO.getUserProfileInfoDTO());
        businessProfileService.editBusinessProfile(user.getBusinessProfile(), userShortInfoDTO.getBusinessProfileDTO());
        userService.changeUserStatus(user, UserStatus.VERIFICATION_SUCCESS);
        LOGGER.info("Information of user: {} successfully edited by admin", user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("User profile successfully edited by admin");
    }

    private void editUserProfileByAdmin(UserProfile userProfile, EditedProfile editedProfile, UserProfileInfoDTO userProfileInfoDTO) {
        if (userProfile != null) {
            userProfile = editUserProfile(userProfile, userProfileInfoDTO);
        } else if (editedProfile != null) {
            userProfile = createUserProfile(userProfileInfoDTO, editedProfile.getUsers());
        } else {
            throw new BadRequest400Exception(PROFILE_NOT_FOUND);
        }
        userProfileRepository.save(userProfile);
        if (editedProfile != null) {
            editedProfileRepository.delete(editedProfile);
        }
        LOGGER.info("Admin edited profile of user: {} successfully", userProfile.getUsers().getEmail());
    }

    @Override
    public UserProfileViewDTO getUserProfileForBusiness(Long profileId) {
        Optional<UserProfile> userProfile = userProfileRepository.findByIdAndUsers_StatusIsNot(profileId, UserStatus.PENDING);
        UserProfile profile = userProfile.orElseThrow(() -> new NotFound404Exception("User is not available"));
        UserProfileViewDTO userProfileViewDTO = UserProfileViewDTOMapper.INSTANCE.map(profile);
        User profileOwner = profile.getUsers();
        User currentUser = userService.getCurrentUser();
        if (profileOwner.equals(currentUser)) {
            EditedProfile editedProfile = profileOwner.getEditedProfile();
            if (editedProfile != null) {
                userProfileViewDTO.setAdminsComment(editedProfile.getAdminsComment());
            }
        }
        FeedbackDataDTO feedbackDataDTO = feedbackService.getFeedbackData(profileId);
        userProfileViewDTO.setAverageFeedback(feedbackDataDTO.getAverage());
        userProfileViewDTO.setFeedbackQuantity(feedbackDataDTO.getQuantity());
        if (userService.getCurrentUser().equals(profile.getUsers())) {
            userProfileViewDTO.setCurrentUser(true);
        }
        return userProfileViewDTO;
    }

    @Override
    public UserManagementDTO getAllProfiles() {
        List<UsersDetailsForAdminDTO> approved = userRepository
            .findUsersByStatusIsAndBlockedFalse(UserStatus.VERIFICATION_SUCCESS)
            .stream()
            .map(UsersDetailsForAdminDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
        List<UsersDetailsForAdminDTO> pending = userRepository
            .getPendingUsers(List.of(UserStatus.PENDING, UserStatus.EDITED))
            .stream()
            .map(UsersDetailsForAdminDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
        List<UsersDetailsForAdminDTO> blocked = userRepository
            .findByBlockedTrueOrStatusIs(UserStatus.VERIFICATION_FAILED)
            .stream()
            .map(UsersDetailsForAdminDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
        List<UsersDetailsForAdminDTO> newUsers = userRepository
            .findAllByStatusIn(List.of(UserStatus.SOCIAL_SIGN_UP, UserStatus.NO_BUSINESS, UserStatus.NEW, UserStatus.CHARGEBEE_SIGN_UP))
            .stream()
            .map(UsersDetailsForAdminDTOMapper.INSTANCE::map)
            .collect(Collectors.toList());
        return UserManagementDTO
            .builder()
            .approvedCounter(approved.size())
            .approvedList(approved)
            .pendingCounter(pending.size())
            .pendingList(pending)
            .blockedCounter(blocked.size())
            .blockedList(blocked)
            .newCounter(newUsers.size())
            .newList(newUsers)
            .build();
    }

    @Override
    @Transactional
    public RestMessageDTO userProfileVerificationSuccess(Long userId) {
        LOGGER.info("Verification of approving for user profile with user id: {}", userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
        EditedProfile editedProfile = user.getEditedProfile();
        UserProfile userProfile = user.getUserProfile();
        UserProfileInfoDTO userProfileInfoDTO = UserProfileInfoDTOMapper.INSTANCE.map(editedProfile);
        if (userProfile != null) {
            userProfile = editUserProfile(userProfile, userProfileInfoDTO);
        } else {
            userProfile = createUserProfile(userProfileInfoDTO, user);
        }
        userProfileRepository.save(userProfile);
        editedProfileRepository.delete(editedProfile);
        if (user.getStatus().equals(UserStatus.PENDING)) {
            notificationService.sendProfileApprovedNotification(user);
            emailService.sendVerificationSuccessEmail(user);
        }
        userService.changeUserStatus(user, UserStatus.VERIFICATION_SUCCESS);
        LOGGER.info("Profile verification of user: {} was successfully approved", user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("UserProfile verification was approved");
    }

    private UserProfile editUserProfile(UserProfile userProfile, UserProfileInfoDTO userProfileInfoDTO) {
        userProfile.setCertificate(userProfileInfoDTO.getCertificate());
        userProfile.setPublicBio(userProfileInfoDTO.getPublicBio());
        userProfile.setExperience(Experience.valueOf(userProfileInfoDTO.getExperience()));
        userProfile.setEquipment(userProfileInfoDTO.getEquipment());
        userProfile.setResources(userProfileInfoDTO.getResources());
        userProfile.setImages(userProfileInfoDTO.getImages());
        userProfile.setVideos(userProfileInfoDTO.getVideos());
        userProfile.setAddress(userProfileInfoDTO.getLocationDTO().getAddress());
        userProfile.setWorkerRoles(WorkerRole.ofRoles(userProfileInfoDTO.getRoles()));
        userProfile.setLatitude(new BigDecimal(userProfileInfoDTO.getLocationDTO().getLat()));
        userProfile.setLongitude(new BigDecimal(userProfileInfoDTO.getLocationDTO().getLng()));
        userProfile.setTimezone(getTimezone(userProfile.getLongitude(), userProfile.getLatitude()));
        if (!userProfile.getUsers().getImage().getUrl().equals(userProfileInfoDTO.getProfilePhoto().getUrl())) {
            amazonStorageService.deleteUserImageByName(userProfile.getUsers().getImage().getFullName(), userProfile.getUsers());
            imageService.editUsersImage(userProfileInfoDTO.getProfilePhoto().getUrl(), userProfile.getUsers());
        }
        return userProfile;
    }

    private UserProfile createUserProfile(UserProfileInfoDTO userProfileInfoDTO, User user) {
        UserProfile userProfile = UserProfileMapper.INSTANCE.map(userProfileInfoDTO);
        userProfile.setTimezone(getTimezone(userProfile.getLongitude(), userProfile.getLatitude()));
        userProfile.setUsers(user);
        if (user.getImage() == null) {
            imageService.createUsersImage(userProfileInfoDTO.getProfilePhoto().getUrl(), user);
        } else if (!user.getImage().getUrl().equals(userProfileInfoDTO.getProfilePhoto().getUrl())) {
            imageService.editUsersImage(userProfileInfoDTO.getProfilePhoto().getUrl(), user);
        }
        return userProfile;
    }

    @Override
    @Transactional
    public RestMessageDTO userProfileVerificationFailed(Long userId, String comment) {
        LOGGER.info("Verification of declining with comment: {}, for user profile with user id: {}", comment, userId);
        User user = userRepository.findById(userId).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
        EditedProfile editedProfile = user.getEditedProfile();
        if (!user.getStatus().equals(UserStatus.EDITED)) {
            userService.changeUserStatus(user, UserStatus.VERIFICATION_FAILED);
        }
        editedProfile.setAdminsComment(comment);
        editedProfileRepository.save(editedProfile);
        emailService.sendVerificationFailedEmail(user);
        notificationService.sendProfileDeclinedNotification(user);
        LOGGER.info("Profile verification of user: {} was successfully declined", user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("UserProfile verification was declined");
    }

    @Override
    public ProfileNamesDTO getProfileNames() {
        return ProfileNamesDTOMapper.INSTANCE.map(userService.getCurrentUser());
    }

    private void validationForUserProfile(UserProfileDTO userProfileDTO) {
        Validator.validateForNulls(userProfileDTO);
        if (userProfileDTO.getRoles().contains(WorkerRole.VIDEOGRAPHER)) {
            boolean validVideo = userProfileDTO.getVideos().stream().allMatch(VideoURLChecker::isValid);
            if (!validVideo) {
                throw new BadRequest400Exception("Video is not valid");
            }
        }
    }

    private void validationForLaterProfile(UserProfileDTO userProfileDTO) {
        if (userProfileDTO.getRoles().contains(WorkerRole.VIDEOGRAPHER)) {
            boolean validVideo = userProfileDTO.getVideos().stream().allMatch(VideoURLChecker::isValid);
            if (!validVideo) {
                throw new BadRequest400Exception("Video is not valid");
            }
        }
    }

    @Override
    public UserProfileIdDTO getProfileId(Long jobId) {
        User user = userRepository.findById(jobId).orElseThrow(() -> new NotFound404Exception(USER_NOT_FOUND));
        return new UserProfileIdDTO(user.getUserProfile().getId().toString());
    }

}
