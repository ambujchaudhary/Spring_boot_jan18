package com.sombrainc.util;

import org.apache.commons.lang.RandomStringUtils;

public final class RandomUtil {

    private static final int DEFAULT_TOKEN_SIZE = 30;

    private RandomUtil() {
    }

    public static String generateToken() {
        return RandomStringUtils.randomAlphanumeric(DEFAULT_TOKEN_SIZE).toUpperCase();
    }
}
