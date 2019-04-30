package com.sombrainc.service.impl;

import com.amazonaws.AmazonServiceException;
import com.amazonaws.SdkClientException;
import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSCredentialsProvider;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.DeleteObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.sombrainc.dto.FileDetailsDTO;
import com.sombrainc.entity.EditedProfile;
import com.sombrainc.entity.User;
import com.sombrainc.exception.BadRequest400Exception;
import com.sombrainc.service.AmazonStorageService;
import com.sombrainc.service.ImageService;
import com.sombrainc.service.UserService;
import com.sombrainc.util.FileUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;

import static com.sombrainc.util.FileUtil.deleteLocalFile;
import static com.sombrainc.util.FileUtil.generateFileName;

@Slf4j
@Service
public class AmazonStorageServiceImpl implements AmazonStorageService, InitializingBean {

    private AmazonS3 s3client;

    private static final String SIZE_200_PREFIX = "size200";

    private static final String SIZE_50_PREFIX = "size50";

    @Value("${amazonProperties.endpointUrl}")
    private String endpointUrl;

    @Value("${amazonProperties.bucketName}")
    private String bucketName;

    @Value("${amazonProperties.accessKey}")
    private String accessKey;

    @Value("${amazonProperties.secretKey}")
    private String secretKey;

    @Autowired
    private ImageService imageService;

    @Autowired
    private UserService userService;

    @Override
    public void afterPropertiesSet() throws Exception {
        AWSCredentials credentials = new BasicAWSCredentials(this.accessKey, this.secretKey);
        AWSCredentialsProvider provider = new AWSStaticCredentialsProvider(credentials);
        this.s3client = AmazonS3ClientBuilder.standard().withCredentials(provider).withRegion(Regions.AP_SOUTHEAST_2).build();
    }

    @Override
    public File convertMultipartToFile(MultipartFile file) {
        File newFile = new File(file.getOriginalFilename());
        try (FileOutputStream fos = new FileOutputStream(newFile)) {
            fos.write(file.getBytes());
        } catch (IOException e) {
            LOGGER.error("File {0} was not converted", file.getOriginalFilename());
        }
        return newFile;
    }

    private void uploadFileToS3bucket(String fileName, File file) {
        s3client.putObject(new PutObjectRequest(bucketName, fileName, file).withCannedAcl(CannedAccessControlList.PublicRead));
    }

    @Override
    public String uploadFile(File file, String newFileName) {
        String encodedId = encodeUserId(userService.getCurrentUser());
        String fileUrl = endpointUrl + bucketName + "/" + encodedId + "/" + newFileName;
        try {
            uploadFileToS3bucket(encodedId + "/" + newFileName, file);
            deleteLocalFile(file);
        } catch (SdkClientException ex) {
            LOGGER.error("{} upload failed", newFileName);
        }
        return fileUrl;
    }

    @Override
    public String uploadImage(File file, String newFileName) {
        String encodedId = encodeUserId(userService.getCurrentUser());
        String fileUrl = endpointUrl + bucketName + "/" + encodedId + "/" + newFileName;
        try {
            uploadFileToS3bucket(encodedId + "/" + newFileName, file);
        } catch (SdkClientException ex) {
            LOGGER.error("{} upload image failed", newFileName);
        }
        return fileUrl;
    }

    private String encodeUserId(User user) {
        return DigestUtils.md5Hex(user.getId().toString());
    }

    @Override
    public FileDetailsDTO uploadAttachment(MultipartFile multipartFile) {
        File file = convertMultipartToFile(multipartFile);
        if (!(FileUtil.isSupportedType(file) || imageService.isSupportedImage(file))) {
            deleteLocalFile(file);
            throw new BadRequest400Exception("The attachment format is not accepted");
        }
        String newFileName = generateFileName(multipartFile.getOriginalFilename());
        String url = uploadFile(file, newFileName);
        return FileDetailsDTO.builder().originalName(multipartFile.getOriginalFilename()).url(url).fullName(newFileName).build();
    }

    @Override
    public FileDetailsDTO uploadCertificate(MultipartFile multipartFile) {
        File file = convertMultipartToFile(multipartFile);
        if (!(FileUtil.isPdf(file) || imageService.isSupportedImage(file))) {
            deleteLocalFile(file);
            throw new BadRequest400Exception("The attachment format is not accepted");
        }
        String newFileName = generateFileName(multipartFile.getOriginalFilename());
        String url = uploadFile(file, newFileName);
        return FileDetailsDTO.builder().originalName(multipartFile.getOriginalFilename()).url(url).fullName(newFileName).build();
    }

    @Override
    public String deleteFileFromS3Bucket(String fullName) {
        LOGGER.info("Deleting file {}", fullName);
        try {
            s3client.deleteObject(new DeleteObjectRequest(bucketName, fullName));
        } catch (AmazonServiceException ex) {
            LOGGER.error("The call was transmitted successfully, but Amazon S3 couldn't process ");
            throw new BadRequest400Exception("File delete failed");
        } catch (SdkClientException ex) {
            LOGGER.error("Amazon S3 couldn't be contacted for a response");
            throw new BadRequest400Exception("File delete failed");
        }
        return fullName;
    }

    @Override
    public void deleteFileByName(String fullName) {
        String userFolder = encodeUserId(userService.getCurrentUser());
        LOGGER.info("Deleting image {}", fullName);
        deleteFileFromS3Bucket(userFolder + "/" + fullName);
        deleteFileFromS3Bucket(userFolder + "/" + SIZE_200_PREFIX + fullName);
    }

    @Override
    public void deleteUserImageByName(String fullName, User user) {
        String userFolder = encodeUserId(user);
        LOGGER.info("Deleting image {}", fullName);
        deleteFileFromS3Bucket(userFolder + "/" + fullName);
        deleteFileFromS3Bucket(userFolder + "/" + SIZE_200_PREFIX + fullName);
        deleteFileFromS3Bucket(userFolder + "/" + SIZE_50_PREFIX + fullName);
    }

    @Override
    public void deleteFileFromEditedProfile(String fullName) {
        EditedProfile editedProfile = userService.getCurrentUser().getEditedProfile();
        if (editedProfile != null) {
            editedProfile.setProfilePhoto(null);
        }
    }
}
