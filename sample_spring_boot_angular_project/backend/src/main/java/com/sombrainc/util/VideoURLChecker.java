package com.sombrainc.util;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public final class VideoURLChecker {

    private static final String YOUTUBE_VIMEO_REGEX = "^(((http(s))|(Http(s)))?:\\/\\/)?(m.|player.|www.)?(vimeo\\.com|wistia|mediazilla|facebook|youtu(be|.be))?(\\.com)?\\/.+";

    private VideoURLChecker() {
    }

    public static boolean isValid(String url) {
        Pattern pattern = Pattern.compile(YOUTUBE_VIMEO_REGEX);
        Matcher matcher = pattern.matcher(url);
        return matcher.matches();
    }
}
