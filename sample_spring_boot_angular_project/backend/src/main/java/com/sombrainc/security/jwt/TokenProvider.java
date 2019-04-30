package com.sombrainc.security.jwt;

import com.sombrainc.entity.User;
import io.jsonwebtoken.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Component
public class TokenProvider {

    private static final String SECRET_KEY = "SuperSecretKey";

    private static final long EXPIRE_IN_SECONDS = 3600000;

    public String createToken(Authentication authentication, User shootzuUser) {
        LocalDateTime expireIn = LocalDateTime.now().plusSeconds(EXPIRE_IN_SECONDS);
        Date date = Date.from(expireIn.atZone(ZoneId.systemDefault()).toInstant());
        return Jwts
            .builder()
            .setSubject(authentication.getName())
            .claim("role", authentication.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
            .claim("first", shootzuUser.getFirstName())
            .claim("last", shootzuUser.getLastName())
            .setExpiration(date)
            .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
            .compact();
    }

    public String createTokenFromUser(User user) {
        LocalDateTime expireIn = LocalDateTime.now().plusSeconds(EXPIRE_IN_SECONDS);
        Date date = Date.from(expireIn.atZone(ZoneId.systemDefault()).toInstant());
        return Jwts
            .builder()
            .setSubject(user.getEmail())
            .claim("role", List.of(user.getRole().getAuthority()))
            .claim("first", user.getFirstName())
            .claim("last", user.getLastName())
            .setExpiration(date)
            .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
            .compact();
    }

    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(token).getBody();
        Collection<? extends GrantedAuthority> authorities = ((List<String>) claims.get("role"))
            .stream()
            .map(SimpleGrantedAuthority::new)
            .collect(Collectors.toList());
        org.springframework.security.core.userdetails.User principal = new org.springframework.security.core.userdetails.User(
            claims.getSubject(), "", authorities);
        return new UsernamePasswordAuthenticationToken(principal, token, authorities);
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser().setSigningKey(SECRET_KEY).parseClaimsJws(authToken);
            return true;
        } catch (SignatureException e) {
            LOGGER.info("Invalid JWT signature.");
        } catch (MalformedJwtException e) {
            LOGGER.info("Invalid JWT token.");
        } catch (ExpiredJwtException e) {
            LOGGER.info("Expired JWT token.");
        } catch (UnsupportedJwtException e) {
            LOGGER.info("Unsupported JWT token.");
        } catch (IllegalArgumentException e) {
            LOGGER.info("JWT token compact of handler are invalid.");
        }
        return false;
    }
}
