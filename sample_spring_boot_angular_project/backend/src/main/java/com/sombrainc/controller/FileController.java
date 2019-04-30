package com.sombrainc.controller;

import com.sombrainc.dto.FileDetailsDTO;
import com.sombrainc.dto.ImageDetailsDTO;
import com.sombrainc.dto.RestMessageDTO;
import com.sombrainc.dto.profile.ProfileImageDetailsDTO;
import com.sombrainc.service.AmazonStorageService;
import com.sombrainc.service.ImageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/protected")
public class FileController {

    @Autowired
    private ImageService imageService;

    @Autowired
    private AmazonStorageService amazonStorageService;

    @PostMapping("/certificate")
    public FileDetailsDTO uploadCertificate(@RequestParam("file") MultipartFile file) {
        return amazonStorageService.uploadCertificate(file);
    }

    @PostMapping("/attachments")
    public FileDetailsDTO uploadAttachment(@RequestParam("file") MultipartFile file) {
        return amazonStorageService.uploadAttachment(file);
    }

    @PostMapping("/image")
    public ImageDetailsDTO uploadImage(@RequestParam("file") MultipartFile file) {
        return imageService.uploadImage(file);
    }

    @PostMapping("/profile-image")
    public ProfileImageDetailsDTO uploadProfileImage(@RequestParam("file") MultipartFile file) {
        return imageService.uploadProfileImage(file);
    }

    @DeleteMapping("/certificate/{fullName}")
    public RestMessageDTO deleteCertificate(@PathVariable String fullName) {
        amazonStorageService.deleteFileByName(fullName);
        return RestMessageDTO.createSuccessRestMessageDTO("Certificate successfully deleted");
    }

    @DeleteMapping("/attachments/{fullName}")
    public RestMessageDTO deleteAttachment(@PathVariable String fullName) {
        amazonStorageService.deleteFileByName(fullName);
        return RestMessageDTO.createSuccessRestMessageDTO("Attachment successfully deleted");
    }

    @DeleteMapping("/image/{fullName}")
    public RestMessageDTO deleteImage(@PathVariable String fullName) {
        amazonStorageService.deleteFileByName(fullName);
        return RestMessageDTO.createSuccessRestMessageDTO("Image successfully deleted");
    }

    @DeleteMapping("/profile-image/{fullName}")
    public RestMessageDTO deleteProfileImage(@PathVariable String fullName) {
        amazonStorageService.deleteFileFromEditedProfile(fullName);
        return RestMessageDTO.createSuccessRestMessageDTO("Image successfully deleted");
    }
}
