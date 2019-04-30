package com.sombrainc.util;

import com.sombrainc.entity.User;

public final class UserUtil {

    private UserUtil() {
    }

    public static String getFullName(User user) {
        return user.getFirstName() + " " + user.getLastName();
    }

    public static String concatStrings(String firstName, String lastName) {
        return String.join(" ", firstName, lastName);
    }
}
