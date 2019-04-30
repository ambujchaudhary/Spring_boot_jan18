package com.sombrainc.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.social.UserIdSource;
import org.springframework.social.config.annotation.EnableSocial;
import org.springframework.social.config.annotation.SocialConfigurerAdapter;
import org.springframework.social.connect.*;
import org.springframework.social.connect.support.ConnectionFactoryRegistry;
import org.springframework.social.connect.web.GenericConnectionStatusView;
import org.springframework.social.connect.web.ReconnectFilter;
import org.springframework.social.facebook.api.Facebook;
import org.springframework.social.facebook.connect.FacebookConnectionFactory;
import org.springframework.social.google.api.Google;
import org.springframework.social.google.connect.GoogleConnectionFactory;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.RequestContextHolder;

import java.util.UUID;

@Configuration
@EnableSocial
@ConditionalOnWebApplication
public class SocialConfig extends SocialConfigurerAdapter {

    @Value("${spring.social.google.appId}")
    private String googleAppId;

    @Value("${spring.social.google.appSecret}")
    private String googleAppSecret;

    @Value("${spring.social.facebook.appId}")
    private String facebookAppId;

    @Value("${spring.social.facebook.appSecret}")
    private String facebookAppSecret;

    @Bean
    @ConditionalOnMissingBean(Google.class)
    @Scope(value = "request", proxyMode = ScopedProxyMode.INTERFACES)
    public Google google(ConnectionRepository repository) {
        Connection<Google> connection = repository.findPrimaryConnection(Google.class);
        return connection != null ? connection.getApi() : null;
    }

    @Bean
    @ConditionalOnMissingBean(Facebook.class)
    @Scope(value = "request", proxyMode = ScopedProxyMode.INTERFACES)
    public Facebook facebook(ConnectionRepository repository) {
        Connection<Facebook> connection = repository.findPrimaryConnection(Facebook.class);
        return connection != null ? connection.getApi() : null;
    }

    @Bean(name = { "connect/googleConnect", "connect/googleConnected" })
    @ConditionalOnProperty(prefix = "spring.social", name = "auto-connection-views")
    public GenericConnectionStatusView googleConnectView() {
        return new GenericConnectionStatusView("google", "Google");
    }

    @Bean
    protected ConnectionFactory<?> createConnectionFactory() {
        return new GoogleConnectionFactory(googleAppId, googleAppSecret);
    }

    @Bean
    public ConnectionFactoryLocator connectionFactoryLocator() {
        ConnectionFactoryRegistry registry = new ConnectionFactoryRegistry();
        registry.addConnectionFactory(new GoogleConnectionFactory(googleAppId, googleAppSecret));
        registry.addConnectionFactory(new FacebookConnectionFactory(facebookAppId, facebookAppSecret));
        return registry;
    }

    @Override
    public UserIdSource getUserIdSource() {
        return new SessionIdUserIdSource();
    }

    private static final class SessionIdUserIdSource implements UserIdSource {

        @Override
        public String getUserId() {
            RequestAttributes request = RequestContextHolder.currentRequestAttributes();
            String uuid = (String) request.getAttribute("_socialUserUUID", RequestAttributes.SCOPE_SESSION);
            if (uuid == null) {
                uuid = UUID.randomUUID().toString();
                request.setAttribute("_socialUserUUID", uuid, RequestAttributes.SCOPE_SESSION);
            }
            return uuid;
        }
    }

    @Bean
    public ReconnectFilter apiExceptionHandler(UsersConnectionRepository usersConnectionRepository, UserIdSource userIdSource) {
        return new ReconnectFilter(usersConnectionRepository, userIdSource);
    }

}
