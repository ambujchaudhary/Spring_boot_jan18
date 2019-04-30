package com.sombrainc.controller;

import com.sombrainc.dto.AuthTokenDTO;
import com.sombrainc.dto.FacebookCheckDTO;
import com.sombrainc.dto.FacebookTokenDTO;
import com.sombrainc.security.jwt.JWTTokenDTO;
import com.sombrainc.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/api/public/google")
    public JWTTokenDTO authGoogle(@RequestBody AuthTokenDTO authTokenDTO) {
        return authService.authenticateGoogle(authTokenDTO.getToken());
    }

    @PostMapping("/api/public/facebook")
    public JWTTokenDTO authFacebook(@RequestBody AuthTokenDTO authTokenDTO) {
        return authService.authenticateFacebook(authTokenDTO);
    }

    @PostMapping("/api/public/facebook/check")
    public FacebookCheckDTO checkFacebook(@RequestBody FacebookTokenDTO facebookTokenDTO) {
        return authService.checkFacebookUser(facebookTokenDTO);
    }
}
