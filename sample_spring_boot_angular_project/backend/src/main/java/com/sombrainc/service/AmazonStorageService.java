package com.sombrainc.service;

import com.sombrainc.dto.FileDetailsDTO;
import com.sombrainc.entity.User;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;

public interface AmazonStorageService {

    File convertMultipartToFile(MultipartFile file);

    String uploadFile(File file, String newFileName);

    String uploadImage(File file, String newFileName);

    FileDetailsDTO uploadAttachment(MultipartFile multipartFile);

    FileDetailsDTO uploadCertificate(MultipartFile multipartFile);

    String deleteFileFromS3Bucket(String fileUrl);

    void deleteFileByName(String fullName);

    void deleteUserImageByName(String fullName, User user);

    void deleteFileFromEditedProfile(String fullName);
}
