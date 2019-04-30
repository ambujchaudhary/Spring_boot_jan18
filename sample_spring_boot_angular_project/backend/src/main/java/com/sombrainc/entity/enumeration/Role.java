package com.sombrainc.entity.enumeration;

import java.util.stream.Stream;

import lombok.Getter;

@Getter
public enum Role {

    ROLE_ADMIN("ROLE_ADMIN"), ROLE_USER("ROLE_USER"), ROLE_ANONYMOUS("ROLE_ANONYMOUS");

    private final String authority;

    Role(String authority) {
        this.authority = authority;
    }

    public static Role of(String value) {
        return Stream
            .of(values())
            .filter(role -> role.getAuthority().equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(IllegalArgumentException::new);
    }
}
