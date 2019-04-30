package com.sombrainc.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.sombrainc.dto.*;
import com.sombrainc.dto.job.JobOwnerDTO;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.security.jwt.JWTTokenDTO;

import java.util.List;
import java.util.Optional;

public interface UserService {

    JWTTokenDTO authenticateUser(String email, String password);

    JWTTokenDTO createUser(UserRegistrationDTO registrationDTO);

    AuthUserDTO getLoginAuthUserDTO();

    JWTTokenDTO authenticateSocialUser(String email);

    JWTTokenDTO completeUserRegistration(SocialUserRegistrationDTO registrationDTO);

    boolean isEmailExist(String email);

    RestMessageDTO sendForgotPasswordEmail(ForgotPasswordDTO forgotPasswordDTO);

    RestMessageDTO checkAndChangePassword(RestorePasswordDTO restorePasswordDTO);

    RestMessageDTO changePassword(ChangePasswordDTO changePasswordDTO);

    boolean checkConfirmationToken(String token);

    User getCurrentUser();

    String getCurrentUserEmail();

    boolean isSocialUserExist(String email, String socialId);

    User findUserByEmailIfExist(String email);

    JobOwnerDTO getJobOwnerDTO();

    JobOwnerDTO getJobOwnerDTOForAdmin(Long userId);

    void changeUserStatus(User user, UserStatus userStatus);

    RestMessageDTO blockUser(Long userId);

    RestMessageDTO unblockUser(Long userId);

    void createUserFromPayload(GoogleIdToken.Payload payload);

    void createUserFromFacebookData(FacebookUserDTO facebookUserDTO);

    List<User> getAdminEmails();

    Optional<User> findBySocialId(String socialId);
}
