package com.sombrainc.service;

import com.sombrainc.dto.ImageDetailsDTO;
import com.sombrainc.dto.profile.ProfileImageDetailsDTO;
import com.sombrainc.dto.profile.UserProfileDTO;
import com.sombrainc.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

public interface ImageService {

    boolean isJpegImage(File file);

    boolean isSupportedImage(File file);

    ImageDetailsDTO uploadImage(MultipartFile multipartFile);

    ProfileImageDetailsDTO uploadProfileImage(MultipartFile multipartFile);

    void deleteUnneededImages(UserProfileDTO userProfileDTO);

    void deleteTemporalImages();

    void deleteImageByFullName(String fullName);

    void createUsersImage(String profilePhoto, User user);

    void editUsersImage(String profilePhoto, User user);

}
