package com.sombrainc.service.impl;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.sombrainc.dto.*;
import com.sombrainc.dto.job.JobOwnerDTO;
import com.sombrainc.entity.TemporalLink;
import com.sombrainc.entity.User;
import com.sombrainc.entity.enumeration.Role;
import com.sombrainc.entity.enumeration.TemporalLinkType;
import com.sombrainc.entity.enumeration.UserStatus;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.Unauthorized401Exception;
import com.sombrainc.repository.TemporalLinkRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.security.jwt.JWTTokenDTO;
import com.sombrainc.security.jwt.TokenProvider;
import com.sombrainc.service.EmailService;
import com.sombrainc.service.SettingsService;
import com.sombrainc.service.UserService;
import com.sombrainc.service.mapper.AuthUserDTOMapper;
import com.sombrainc.service.mapper.UserMapper;
import com.sombrainc.util.UserUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static com.sombrainc.dto.RestMessageDTO.createSuccessRestMessageDTO;

@Slf4j
@Service
public class UserServiceImpl implements UserService {

    @Value("${mail.activation.expiration.hours}")
    private int linkExpiryHour;

    private static final String INACTIVE_TOKEN = "change_password.token_invalid";

    private static final String FIRST_NAME = "given_name";

    private static final String LAST_NAME = "family_name";

    private static final String REGISTERED_MANUALLY = "This email already registered with password.";

    private static final String REGISTERED_WITH_SOCIAL_MEDIA = "Registered with another social media";

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private TemporalLinkRepository temporalLinkRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private SettingsService settingsService;

    @Autowired
    private TokenProvider tokenProvider;

    @Override
    public JWTTokenDTO authenticateUser(String email, String password) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, password);
        if (userRepository.findByEmailAndBlockedIsTrue(email).isPresent()) {
            throw new BadRequest400Exception("User is disabled");
        }
        try {
            Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            final User user = findUserByEmailIfExist(authentication.getName());
            String jwt = tokenProvider.createToken(authentication, user);
            LOGGER.info("User: {} successfully authenticated", email);
            return JWTTokenDTO.of(jwt);
        } catch (AuthenticationException ae) {
            LOGGER.error("Authentication exception trace: {}", ae);
            throw new BadRequest400Exception("You enter incorrect e-mail or password");
        }
    }

    @Override
    public JWTTokenDTO authenticateSocialUser(String email) {
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(email, email);
        Authentication authentication = this.authenticationManager.authenticate(authenticationToken);
        SecurityContextHolder.getContext().setAuthentication(authentication);
        final User user = findUserByEmailIfExist(authentication.getName());
        String jwt = tokenProvider.createToken(authentication, user);
        LOGGER.info("Social user: {} successfully authenticated", email);
        return JWTTokenDTO.of(jwt);
    }

    @Override
    @Transactional
    public JWTTokenDTO createUser(final UserRegistrationDTO registrationDTO) {
        LOGGER.info("Creating user: {}", registrationDTO);
        if (userRepository.findOneByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new BadRequest400Exception("register.email.already_exists");
        }
        if (!(registrationDTO.getPassword().equals(registrationDTO.getConfirmPassword()))) {
            throw new BadRequest400Exception("register.password_not_match");
        }
        User user = UserMapper.INSTANCE.map(registrationDTO);
        user.setPassword(passwordEncoder.encode(registrationDTO.getPassword()));
        user.setSettings(settingsService.createSettings(user));
        userRepository.save(user);
        LOGGER.info("User: {} successfully created", user.getEmail());
        return authenticateUser(registrationDTO.getEmail(), registrationDTO.getPassword());
    }

    @Override
    @Transactional
    public RestMessageDTO sendForgotPasswordEmail(ForgotPasswordDTO forgotPasswordDTO) {
        User user = userRepository
            .findOneByEmail(forgotPasswordDTO.getEmail())
            .orElseThrow(() -> new BadRequest400Exception("Your email address is not valid"));
        if (user.getSocialId() != null) {
            throw new BadRequest400Exception("You're registered without password.");
        }
        TemporalLink temporalLink = TemporalLink.createForgotPasswordLink(linkExpiryHour, user);
        temporalLinkRepository.save(temporalLink);
        emailService.sendConfirmForgotPasswordEmail(user, temporalLink.getToken());
        LOGGER.info("Email with generated token was successfully sent to user: {}", user.getEmail());
        return RestMessageDTO.createSuccessRestMessageDTO("Please, check your email.");
    }

    @Override
    @Transactional
    public RestMessageDTO checkAndChangePassword(RestorePasswordDTO restorePasswordDTO) {
        if (!checkConfirmationToken(restorePasswordDTO.getToken())) {
            throw new BadRequest400Exception(INACTIVE_TOKEN);
        }
        if (!(restorePasswordDTO.getPassword()).equals(restorePasswordDTO.getConfirmPassword())) {
            throw new BadRequest400Exception("Your password is not equal to your password confirm.");
        }
        TemporalLink temporalLink = temporalLinkRepository.findByTokenAndTypeAndActiveIsTrueAndExpiryDateIsAfter(
            restorePasswordDTO.getToken(), TemporalLinkType.FORGOT_PASSWORD_CONFIRMATION, LocalDateTime.now());
        if (temporalLink == null) {
            throw new BadRequest400Exception(INACTIVE_TOKEN);
        }
        User user = temporalLink.getUsers();
        user.setPassword(passwordEncoder.encode(restorePasswordDTO.getPassword()));
        userRepository.save(user);
        temporalLinkRepository.updateActiveTemporalLinkByToken(restorePasswordDTO.getToken(), false);
        LOGGER.info("Password of user: {} was successfully restored", user.getEmail());
        return createSuccessRestMessageDTO("Password for user " + user.getEmail() + " was successfully changed.");
    }

    @Override
    @Transactional
    public RestMessageDTO changePassword(ChangePasswordDTO changePasswordDTO) {
        if (!(changePasswordDTO.getNewPassword()).equals(changePasswordDTO.getConfirmPassword())) {
            throw new BadRequest400Exception("Your password is not equal to your password confirm.");
        }
        User user = getCurrentUser();
        if (!passwordEncoder.matches(changePasswordDTO.getOldPassword(), user.getPassword())) {
            throw new BadRequest400Exception("Your old password is incorrect");
        }
        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepository.save(user);
        return createSuccessRestMessageDTO("Password successfully changed for user: " + user.getEmail());
    }

    @Override
    public boolean checkConfirmationToken(String token) {
        return temporalLinkRepository.existsByTokenAndActiveIsTrue(token);
    }

    @Override
    public User getCurrentUser() {
        String currentUserEmail = getCurrentUserEmail();
        return findUserByEmailIfExist(currentUserEmail);
    }

    @Override
    public String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null) {
            throw new Unauthorized401Exception("User authentication is required");
        }
        return authentication.getName();
    }

    @Override
    @Transactional
    public JWTTokenDTO completeUserRegistration(final SocialUserRegistrationDTO registrationDTO) {
        if (userRepository.findOneByEmail(registrationDTO.getEmail()).isPresent()) {
            throw new BadRequest400Exception("Email address already exist");
        }
        SecurityContext securityContext = SecurityContextHolder.getContext();
        Authentication authentication = securityContext.getAuthentication();
        Object principal = authentication.getPrincipal();
        UserDetails userDetails = (UserDetails) principal;
        User user = userRepository.findOneByEmail(userDetails.getUsername()).orElseThrow(() -> new BadRequest400Exception("Invalid email"));
        if (registrationDTO.getEmail() != null && !registrationDTO.getEmail().isEmpty()) {
            user.setEmail(registrationDTO.getEmail());
        }
        changeUserStatus(user, UserStatus.SOCIAL_SIGN_UP);
        return authenticateSocialUser(user.getSocialId());
    }

    @Override
    public AuthUserDTO getLoginAuthUserDTO() {
        SecurityContext securityContext = SecurityContextHolder.getContext();
        return getAuthUserFromAuthentication(securityContext.getAuthentication());
    }

    private AuthUserDTO getAuthUserFromAuthentication(Authentication authentication) {
        if (authentication == null) {
            return AuthUserDTO.builder().role(Role.ROLE_ANONYMOUS).build();
        }
        Object principal = authentication.getPrincipal();
        if (principal instanceof String && (principal).equals("anonymousUser")) {
            return AuthUserDTO.builder().role(Role.ROLE_ANONYMOUS).build();
        }
        User user;
        if (principal instanceof String) {
            user = findUserByEmailIfExist(principal.toString());
        } else {
            UserDetails userDetails = (UserDetails) principal;
            user = findUserByEmailIfExist(userDetails.getUsername());
        }
        return AuthUserDTOMapper.INSTANCE.map(user);
    }

    @Override
    public boolean isEmailExist(String email) {
        return userRepository.findOneByEmail(email).isPresent();
    }

    @Override
    public boolean isSocialUserExist(String email, String socialId) {
        return userRepository.findOneByEmail(email).isPresent() || userRepository.findOneBySocialId(socialId).isPresent();
    }

    @Override
    public User findUserByEmailIfExist(String email) {
        return userRepository.findOneByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Invalid email"));
    }

    @Override
    public JobOwnerDTO getJobOwnerDTO() {
        User user = getCurrentUser();
        return JobOwnerDTO
            .builder()
            .businessName(user.getBusinessProfile().getBusinessName())
            .personalName(UserUtil.concatStrings(user.getFirstName(), user.getLastName()))
            .build();
    }

    @Override
    public JobOwnerDTO getJobOwnerDTOForAdmin(Long userId) {
        User user = userRepository.findById(userId).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return JobOwnerDTO
            .builder()
            .businessName(user.getBusinessProfile().getBusinessName())
            .personalName(UserUtil.concatStrings(user.getFirstName(), user.getLastName()))
            .build();
    }

    @Override
    public void changeUserStatus(User user, UserStatus userStatus) {
        user.setStatus(userStatus);
        userRepository.save(user);
    }

    @Override
    public RestMessageDTO blockUser(Long userId) {
        User user = userRepository.getOne(userId);
        user.setBlocked(Boolean.TRUE);
        userRepository.save(user);
        return RestMessageDTO.createSuccessRestMessageDTO("User blocked");
    }

    @Override
    public RestMessageDTO unblockUser(Long userId) {
        User user = userRepository.getOne(userId);
        user.setBlocked(Boolean.FALSE);
        userRepository.save(user);
        return RestMessageDTO.createSuccessRestMessageDTO("User unblocked");
    }

    @Override
    public void createUserFromPayload(GoogleIdToken.Payload payload) {
        String email = payload.getEmail();
        Optional<User> user = userRepository.findOneByEmail(email);
        if (!user.isPresent()) {
            User newUser = User
                .builder()
                .socialId(payload.getSubject())
                .email(email)
                .firstName(payload.get(FIRST_NAME).toString())
                .lastName(payload.get(LAST_NAME).toString())
                .password(passwordEncoder.encode(payload.getSubject()))
                .role(Role.ROLE_USER)
                .status(UserStatus.SOCIAL_SIGN_UP)
                .build();
            newUser.setSettings(settingsService.createSettings(newUser));
            userRepository.save(newUser);
        } else {
            if (user.get().getSocialId() == null) {
                throw new Unauthorized401Exception(REGISTERED_MANUALLY);
            }
            if (!payload.getSubject().equals(user.get().getSocialId())) {
                throw new Unauthorized401Exception(REGISTERED_WITH_SOCIAL_MEDIA);
            }
        }
    }

    @Override
    public void createUserFromFacebookData(FacebookUserDTO facebookUserDTO) {
        if (!userRepository.findOneBySocialId(facebookUserDTO.getId()).isPresent() && !existSocialUser(facebookUserDTO)) {
            User user = User
                .builder()
                .socialId(facebookUserDTO.getId())
                .email(facebookUserDTO.getEmail())
                .firstName(facebookUserDTO.getFirstName())
                .lastName(facebookUserDTO.getLastName())
                .password(passwordEncoder.encode(facebookUserDTO.getId()))
                .role(Role.ROLE_USER)
                .status(UserStatus.SOCIAL_SIGN_UP)
                .build();
            user.setSettings(settingsService.createSettings(user));
            userRepository.save(user);
        }
    }

    private boolean existSocialUser(FacebookUserDTO facebookUserDTO) {
        if (facebookUserDTO.getEmail() != null) {
            Optional<User> user = userRepository.findOneByEmail(facebookUserDTO.getEmail());
            if (user.isPresent()) {
                if (user.get().getSocialId() == null) {
                    throw new Unauthorized401Exception(REGISTERED_MANUALLY);
                }
                if (!facebookUserDTO.getId().equals(user.get().getSocialId())) {
                    throw new Unauthorized401Exception(REGISTERED_WITH_SOCIAL_MEDIA);
                }
                return true;
            }
        }
        return false;
    }

    @Override
    public List<User> getAdminEmails() {
        return userRepository.findByRole(Role.ROLE_ADMIN);
    }

    @Override
    public Optional<User> findBySocialId(String socialId) {
        return userRepository.findOneBySocialId(socialId);
    }
}
