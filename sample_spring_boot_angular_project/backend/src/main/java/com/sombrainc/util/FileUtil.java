package com.sombrainc.util;

import com.sombrainc.dto.FileDetailsDTO;
import com.sombrainc.dto.ImageDetailsDTO;
import com.sombrainc.dto.profile.ProfileImageDetailsDTO;
import lombok.extern.slf4j.Slf4j;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@Slf4j
public final class FileUtil {

    private static final String SIZE_200_PREFIX = "size200";

    private static final String SIZE_50_PREFIX = "size50";

    private static final String PDF = "application/pdf";

    private static final Set<String> supportedAttachments = Set.of("application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", PDF, "image/png", "image/jpeg");

    private FileUtil() {
    }

    public static FileDetailsDTO getFileDetailsFromURL(String url) {
        if (Objects.nonNull(url)) {
            String fullName = url.substring(url.lastIndexOf('/') + 1);
            String originalName = fullName.substring(fullName.indexOf('-') + 1);
            return FileDetailsDTO.builder().url(url).fullName(fullName).originalName(originalName).build();
        } else {
            return null;
        }
    }

    public static List<FileDetailsDTO> getFileDetailsList(List<String> urls) {
        return urls.stream().map(FileUtil::getFileDetailsFromURL).collect(Collectors.toList());
    }

    private static ImageDetailsDTO getImageDetailsFromURL(String url) {
        if (Objects.nonNull(url)) {
            String fullName = url.substring(url.lastIndexOf('/') + 1);
            String originalName = fullName.substring(fullName.indexOf('-') + 1);
            String size200 = url.replace(fullName, SIZE_200_PREFIX + fullName);
            return ImageDetailsDTO.builder().url(url).fullName(fullName).originalName(originalName).size200(size200).build();
        } else {
            return null;
        }
    }

    public static ProfileImageDetailsDTO getProfileImageDetailsFromURL(String url) {
        if (Objects.nonNull(url)) {
            String fullName = url.substring(url.lastIndexOf('/') + 1);
            String originalName = fullName.substring(fullName.indexOf('-') + 1);
            String size200 = url.replace(fullName, SIZE_200_PREFIX + fullName);
            String size50 = url.replace(fullName, SIZE_50_PREFIX + fullName);
            return ProfileImageDetailsDTO
                .builder()
                .url(url)
                .fullName(fullName)
                .originalName(originalName)
                .size200(size200)
                .logo(size50)
                .build();
        } else {
            return null;
        }
    }

    public static List<ImageDetailsDTO> getImageDetailsList(List<String> urls) {
        return urls.stream().map(FileUtil::getImageDetailsFromURL).collect(Collectors.toList());
    }

    public static boolean isPdf(File file) {
        //Files.probeContentType is not supported by mac os
        try {
            String fileType = Files.probeContentType(file.toPath());
            if (PDF.equalsIgnoreCase(fileType)) {
                return true;
            }
        } catch (IOException e) {
            LOGGER.error("Certificate check failed");
        }
        return false;
    }

    public static boolean isSupportedType(File file) {
        try {
            String fileType = Files.probeContentType(file.toPath());
            boolean contains = supportedAttachments.stream().anyMatch(fileType::equalsIgnoreCase);
            if (contains) {
                return true;
            }
        } catch (IOException e) {
            LOGGER.error("Attachment check failed");
        }
        return false;
    }

    public static void deleteLocalFile(File file) {
        try {
            Files.delete(file.toPath());
        } catch (IOException e) {
            LOGGER.error("{} delete failed", file.getName());
        }
    }

    public static String generateFileName(String originalName) {
        return RandomUtil.generateToken() + "-" + originalName.replace(" ", "_").replace("%22", "").replace("(", "").replace(")", "");
    }

}
