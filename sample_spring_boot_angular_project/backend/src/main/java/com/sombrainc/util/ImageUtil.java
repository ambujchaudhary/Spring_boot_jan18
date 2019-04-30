package com.sombrainc.util;

import java.io.File;
import java.io.IOException;
import java.util.Iterator;
import java.util.List;

import javax.imageio.ImageIO;
import javax.imageio.ImageReader;
import javax.imageio.stream.ImageInputStream;

import lombok.extern.slf4j.Slf4j;

@Slf4j
public final class ImageUtil {

    private ImageUtil() {
        throw new UnsupportedOperationException("This is a utility class and cannot be instantiated");
    }

    public static boolean isFormatFromList(File file, List<String> imageFormats) {
        try {
            ImageInputStream inputStream = ImageIO.createImageInputStream(file);
            Iterator<ImageReader> iterator = ImageIO.getImageReaders(inputStream);
            while (iterator.hasNext()) {
                ImageReader reader = iterator.next();
                boolean contains = imageFormats.stream().anyMatch(reader.getFormatName()::equalsIgnoreCase);
                if (contains) {
                    return true;
                }
            }
        } catch (IOException e) {
            LOGGER.error("Check png for image failed", e);
        }
        return false;
    }
}
