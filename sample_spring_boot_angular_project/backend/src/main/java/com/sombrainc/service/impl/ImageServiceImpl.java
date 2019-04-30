package com.sombrainc.service.impl;

import com.sombrainc.dto.ImageDetailsDTO;
import com.sombrainc.dto.profile.ProfileImageDetailsDTO;
import com.sombrainc.dto.profile.UserProfileDTO;
import com.sombrainc.entity.TemporalImage;
import com.sombrainc.entity.User;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.exception.NotFound404Exception;
import com.sombrainc.repository.ImageRepository;
import com.sombrainc.repository.TemporalImageRepository;
import com.sombrainc.service.AmazonStorageService;
import com.sombrainc.service.ImageService;
import com.sombrainc.service.UserService;
import com.sombrainc.util.FileUtil;
import com.sombrainc.util.ImageUtil;
import com.sombrainc.util.JpegReader;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.io.FilenameUtils;
import org.apache.commons.lang.StringUtils;
import org.apache.sanselan.ImageReadException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class ImageServiceImpl implements ImageService {

    private static final int SIZE_200 = 200;

    private static final int SIZE_50 = 50;

    private static final String SIZE_200_PREFIX = "size200";

    private static final String SIZE_50_PREFIX = "size50";

    private static final List<String> supportedFormats = List.of("jpg", "jpeg", "png");

    private static final List<String> jpegFormats = List.of("jpg", "jpeg");

    @Autowired
    private AmazonStorageService amazonStorageService;

    @Autowired
    private TemporalImageRepository temporalImageRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private ImageRepository imageRepository;

    @Autowired
    private JpegReader jpegReader;

    @Override
    public boolean isJpegImage(File file) {
        return ImageUtil.isFormatFromList(file, jpegFormats);
    }

    @Override
    public boolean isSupportedImage(File file) {
        return ImageUtil.isFormatFromList(file, supportedFormats);
    }

    @Override
    @Transactional
    public ImageDetailsDTO uploadImage(MultipartFile multipartFile) {
        LOGGER.info("Uploading multipart file: {}", multipartFile.getOriginalFilename());
        File file = amazonStorageService.convertMultipartToFile(multipartFile);
        if (!isJpegImage(file)) {
            FileUtil.deleteLocalFile(file);
            throw new BadRequest400Exception("Please upload jpg/jpeg image");
        }
        String newFileName = FileUtil.generateFileName(multipartFile.getOriginalFilename());
        String url = amazonStorageService.uploadImage(file, newFileName);
        File size200 = compressImage(file, SIZE_200);
        String size200Url = amazonStorageService.uploadImage(size200, SIZE_200_PREFIX + newFileName);
        FileUtil.deleteLocalFile(file);
        FileUtil.deleteLocalFile(size200);
        saveTemporalImage(url);
        LOGGER.info("Image with url: {} successfully uploaded", url);
        LOGGER.info("Image with size 200px: {} successfully uploaded", size200Url);
        return ImageDetailsDTO
            .builder()
            .url(url)
            .originalName(multipartFile.getOriginalFilename())
            .fullName(newFileName)
            .size200(size200Url)
            .build();
    }

    @Override
    public ProfileImageDetailsDTO uploadProfileImage(MultipartFile multipartFile) {
        LOGGER.info("Uploading profile image: {}", multipartFile.getOriginalFilename());
        File file = amazonStorageService.convertMultipartToFile(multipartFile);
        if (!isJpegImage(file)) {
            FileUtil.deleteLocalFile(file);
            throw new BadRequest400Exception("Please upload jpg/jpeg image");
        }
        String newFileName = FileUtil.generateFileName(multipartFile.getOriginalFilename());
        String url = amazonStorageService.uploadImage(file, newFileName);
        File size200 = compressImage(file, SIZE_200);
        String size200Url = amazonStorageService.uploadImage(size200, SIZE_200_PREFIX + newFileName);
        File size50 = compressImage(file, SIZE_50);
        String size50Url = amazonStorageService.uploadImage(size50, SIZE_50_PREFIX + newFileName);
        FileUtil.deleteLocalFile(file);
        FileUtil.deleteLocalFile(size200);
        FileUtil.deleteLocalFile(size50);
        saveTemporalImage(url);
        LOGGER.info("Image with url: {} successfully uploaded", url);
        LOGGER.info("Image with size 200px: {} successfully uploaded", size200Url);
        LOGGER.info("Image with size 50px: {} successfully uploaded", size50Url);
        return ProfileImageDetailsDTO
            .builder()
            .url(url)
            .originalName(multipartFile.getOriginalFilename())
            .fullName(newFileName)
            .size200(size200Url)
            .logo(size50Url)
            .build();
    }

    private void saveTemporalImage(String temporalImageUrl) {
        TemporalImage temporalImage = new TemporalImage();
        User user = userService.getCurrentUser();
        temporalImage.setUsers(user);
        temporalImage.setImageUrl(temporalImageUrl);
        temporalImageRepository.save(temporalImage);
    }

    @Override
    @Transactional
    public void deleteUnneededImages(UserProfileDTO userProfileDTO) {
        List<String> requiredImages = findRequiredImages(userProfileDTO);
        User user = userService.getCurrentUser();
        List<String> allTempImages = temporalImageRepository.findAllTemporalImageUrlsByUser(user);
        if (allTempImages != null) {
            LOGGER.info("Deleting all unused images from DB and amazon");
            LOGGER.info("all temporal images: {}", allTempImages);
            List<String> unneededImages = findUnneededImages(requiredImages, allTempImages);
            deleteImages(unneededImages);
        }
    }

    private List<String> findRequiredImages(UserProfileDTO userProfileDTO) {
        List<String> requiredImages = new ArrayList<>();
        requiredImages.add(userProfileDTO.getProfilePhoto());
        if (userProfileDTO.getImages() != null) {
            requiredImages.addAll(userProfileDTO.getImages());
        }
        return requiredImages;
    }

    private List<String> findUnneededImages(List<String> requiredImages, List<String> allTempImages) {
        List<String> unneededImages = new ArrayList<>();
        for (String item : allTempImages) {
            if (!requiredImages.contains(item)) {
                unneededImages.add(item);
            }
        }
        return unneededImages;
    }

    private void deleteImages(List<String> unneededImages) {
        LOGGER.info("deleting unused: {} images", unneededImages);
        for (String url : unneededImages) {
            TemporalImage temporalImage = temporalImageRepository.findTemporalImageByImageUrl(url);
            String bucketAndFileName = getBucketAndFileNameFromURL(url);
            String size200Copy = getFileName(url);
            String size200bucketAndFileName = bucketAndFileName.replace(size200Copy, SIZE_200_PREFIX + size200Copy);
            amazonStorageService.deleteFileFromS3Bucket(bucketAndFileName);
            amazonStorageService.deleteFileFromS3Bucket(size200bucketAndFileName);
            temporalImageRepository.delete(temporalImage);
        }
    }

    private String getFileName(String fullUrl) {
        int index = StringUtils.ordinalIndexOf(fullUrl, "/", 5) + 1;
        return fullUrl.substring(index);
    }

    private String getBucketAndFileNameFromURL(String fullUrl) {
        int index = StringUtils.ordinalIndexOf(fullUrl, "/", 4) + 1;
        return fullUrl.substring(index);
    }

    @Override
    public void deleteTemporalImages() {
        User user = userService.getCurrentUser();
        List<TemporalImage> temporalImages = temporalImageRepository.findTemporalImagesByUsers(user);
        if (!temporalImages.isEmpty()) {
            for (TemporalImage item : temporalImages) {
                temporalImageRepository.delete(item);
            }
        }
    }

    @Override
    public void deleteImageByFullName(String fullName) {
        com.sombrainc.entity.Image image = imageRepository
            .findImageByFullName(fullName)
            .orElseThrow(() -> new NotFound404Exception("Image not found"));
        imageRepository.delete(image);
    }

    @Override
    public void createUsersImage(String profilePhoto, User user) {
        ProfileImageDetailsDTO profileImageDetailsDTO = FileUtil.getProfileImageDetailsFromURL(profilePhoto);
        com.sombrainc.entity.Image image = com.sombrainc.entity.Image.createImage(profileImageDetailsDTO.getUrl(),
            profileImageDetailsDTO.getOriginalName(), profileImageDetailsDTO.getFullName(), profileImageDetailsDTO.getSize200(),
            profileImageDetailsDTO.getLogo(), user);
        imageRepository.save(image);
    }

    @Override
    public void editUsersImage(String profilePhoto, User user) {
        ProfileImageDetailsDTO profileImageDetailsDTO = FileUtil.getProfileImageDetailsFromURL(profilePhoto);
        com.sombrainc.entity.Image image = user.getImage();
        image.setUrl(profileImageDetailsDTO.getUrl());
        image.setOriginalName(profileImageDetailsDTO.getOriginalName());
        image.setFullName(profileImageDetailsDTO.getFullName());
        image.setSize200(profileImageDetailsDTO.getSize200());
        image.setLogo(profileImageDetailsDTO.getLogo());
        imageRepository.save(image);
    }

    private File compressImage(File file, int size) {
        String newFileName = "size" + size + file.getName();
        try {
            BufferedImage bufferedImage = jpegReader.readImage(file);
            int sourceWidth = bufferedImage.getWidth();
            int sourceHeight = bufferedImage.getHeight();
            int newHeight = sourceHeight;
            int newWidth = sourceWidth;
            if (sourceHeight > size && sourceWidth > size) {
                if (sourceWidth < sourceHeight) {
                    newHeight = (size * sourceHeight) / sourceWidth;
                    newWidth = size;
                }
                if (sourceHeight < sourceWidth) {
                    newHeight = size;
                    newWidth = (sourceWidth * size) / sourceHeight;
                }
                if (sourceHeight == sourceWidth) {
                    newHeight = size;
                    newWidth = size;
                }
            }
            Image resize = bufferedImage.getScaledInstance(newWidth, newHeight, Image.SCALE_AREA_AVERAGING);
            BufferedImage newImage = new BufferedImage(newWidth, newHeight, bufferedImage.getType());
            Graphics2D graphics = newImage.createGraphics();
            graphics.drawImage(resize, 0, 0, null);
            graphics.dispose();
            ImageIO.write(newImage, FilenameUtils.getExtension(file.getName()), new FileOutputStream(newFileName));
        } catch (IOException | ImageReadException e) {
            LOGGER.error("{} compressing failed", file.getName(), e);
        }
        return new File(newFileName);
    }

}
