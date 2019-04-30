package com.sombrainc.service;

import com.sombrainc.dto.AuthTokenDTO;
import com.sombrainc.dto.FacebookCheckDTO;
import com.sombrainc.dto.FacebookTokenDTO;
import com.sombrainc.security.jwt.JWTTokenDTO;

public interface AuthService {

    JWTTokenDTO authenticateGoogle(String googleToken);

    JWTTokenDTO authenticateFacebook(AuthTokenDTO authTokenDTO);

    FacebookCheckDTO checkFacebookUser(FacebookTokenDTO facebookTokenDTO);
}
