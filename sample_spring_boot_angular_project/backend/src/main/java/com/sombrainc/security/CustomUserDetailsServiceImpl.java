package com.sombrainc.security;

import com.sombrainc.entity.enumeration.Role;
import com.sombrainc.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Slf4j
@Primary
@Service
public class CustomUserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) {
        LOGGER.info("Init parameters method loadUserByUsername: " + email);
        com.sombrainc.entity.User user;
        if (email.contains("@")) {
            user = userRepository.findOneByEmail(email).orElseThrow(() -> new BadCredentialsException("login.incorrect_credentials"));
        } else {
            user = userRepository.findOneBySocialId(email).orElseThrow(() -> new BadCredentialsException("login.incorrect_credentials"));
        }
        Role role = user.getRole();
        final Set<GrantedAuthority> authorities = new HashSet<>();
        authorities.add(new SimpleGrantedAuthority(role.getAuthority()));
        return new User(user.getEmail(), user.getPassword(), !user.isBlocked(), true, true, true, authorities);
    }
}
