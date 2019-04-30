package com.sombrainc.entity.enumeration;

import lombok.Getter;

@Getter
public enum UserStatus {

    PENDING,
    EDITED,
    ENABLED,
    NEW,
    FACEBOOK_NO_EMAIL,
    SOCIAL_SIGN_UP,
    VERIFICATION_FAILED,
    VERIFICATION_SUCCESS,
    NO_BUSINESS,
    CHARGEBEE_SIGN_UP,
    SAVED_FOR_LATER
}
