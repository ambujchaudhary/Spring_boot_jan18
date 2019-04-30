package com.sombrainc.service.impl;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.sombrainc.dto.AuthTokenDTO;
import com.sombrainc.dto.FacebookCheckDTO;
import com.sombrainc.dto.FacebookTokenDTO;
import com.sombrainc.dto.FacebookUserDTO;
import com.sombrainc.entity.User;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.security.jwt.JWTTokenDTO;
import com.sombrainc.service.AuthService;
import com.sombrainc.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class AuthServiceImpl implements AuthService {

    private static final String FACEBOOK_URL = "https://graph.facebook.com/v2.12/me?fields=id,first_name,last_name,email&access_token=%s";

    private static final String FACEBOOK_ERROR = "Fetching facebook user failed";

    public static final String GOOGLE_ERROR = "Invalid token ID";

    @Value("${spring.social.google.appId}")
    private String clientId;

    @Autowired
    private UserService userService;

    private GoogleIdToken.Payload getPayloadFromToken(String googleToken) {
        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(getDefaultHttpTransport(), JacksonFactory.getDefaultInstance())
            .setAudience(List.of(clientId))
            .build();
        try {
            GoogleIdToken idToken = verifier.verify(googleToken);
            if (idToken != null) {
                return idToken.getPayload();
            }
        } catch (GeneralSecurityException | IOException e) {
            LOGGER.error(GOOGLE_ERROR, e);
        }
        throw new BadRequest400Exception(GOOGLE_ERROR);
    }

    @Override
    public JWTTokenDTO authenticateGoogle(String googleToken) {
        GoogleIdToken.Payload payload = getPayloadFromToken(googleToken);
        userService.createUserFromPayload(payload);
        return userService.authenticateSocialUser(payload.getSubject());
    }

    private FacebookUserDTO extractFacebookUserByToken(AuthTokenDTO authTokenDTO) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            String result = restTemplate.getForObject(String.format(FACEBOOK_URL, authTokenDTO.getToken()), String.class);
            ObjectMapper mapper = new ObjectMapper();
            FacebookUserDTO facebookUserDTO = mapper.readValue(result, FacebookUserDTO.class);
            if (authTokenDTO.getEmail() != null) {
                facebookUserDTO.setEmail(authTokenDTO.getEmail());
            }
            return facebookUserDTO;
        } catch (IOException | HttpClientErrorException e) {
            LOGGER.error(FACEBOOK_ERROR);
            throw new BadRequest400Exception(FACEBOOK_ERROR);
        }
    }

    @Override
    public JWTTokenDTO authenticateFacebook(AuthTokenDTO authTokenDTO) {
        FacebookUserDTO facebookUserDTO = extractFacebookUserByToken(authTokenDTO);
        userService.createUserFromFacebookData(facebookUserDTO);
        return userService.authenticateSocialUser(facebookUserDTO.getId());
    }

    @Override
    public FacebookCheckDTO checkFacebookUser(FacebookTokenDTO facebookTokenDTO) {
        RestTemplate restTemplate = new RestTemplate();
        try {
            String result = restTemplate.getForObject(String.format(FACEBOOK_URL, facebookTokenDTO.getToken()), String.class);
            ObjectMapper mapper = new ObjectMapper();
            FacebookUserDTO facebookUserDTO = mapper.readValue(result, FacebookUserDTO.class);
            Optional<User> user = userService.findBySocialId(facebookUserDTO.getId());
            if (user.isPresent()) {
                return FacebookCheckDTO.exist();
            } else {
                return FacebookCheckDTO.notExist();
            }
        } catch (IOException | HttpClientErrorException e) {
            LOGGER.error(FACEBOOK_ERROR);
            throw new BadRequest400Exception(FACEBOOK_ERROR);
        }
    }

    private static HttpTransport getDefaultHttpTransport() {
        return new NetHttpTransport();
    }
}
