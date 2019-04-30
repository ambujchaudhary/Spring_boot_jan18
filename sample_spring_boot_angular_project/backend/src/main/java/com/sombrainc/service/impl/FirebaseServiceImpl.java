package com.sombrainc.service.impl;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import com.sombrainc.dto.FirebaseDataDTO;
import com.sombrainc.entity.FirebaseData;
import com.sombrainc.entity.User;
import com.sombrainc.repository.FirebaseRepository;
import com.sombrainc.repository.UserRepository;
import com.sombrainc.service.FirebaseService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.InitializingBean;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.FileInputStream;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class FirebaseServiceImpl implements FirebaseService, InitializingBean {

    private static final String DEFAULT_SOUND = "default";

    private static final String LINK = "link";

    private static final String JOB_ID = "jobId";

    private static final String CHAT_USER_ID = "userId";

    private static final String FIREBASE_FILE_CONFIG = "shootzu-45853-firebase-adminsdk-ov2te-dbbac66c4a.json";

    private static final String DATABASE_URL = "https://shootzu-45853.firebaseio.com/";

    @Autowired
    private FirebaseRepository firebaseRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public void afterPropertiesSet() throws Exception {
        FileInputStream serviceAccount = new FileInputStream(FIREBASE_FILE_CONFIG);

        FirebaseOptions options = new FirebaseOptions.Builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccount))
            .setDatabaseUrl(DATABASE_URL)
            .build();

        FirebaseApp.initializeApp(options);
    }

    @Override
    public void sendNotification(String title, String body, long userId, String link) {
        sendNotification(title, body, userId, link, null, null);
    }

    @Override
    public void sendNotification(String title, String body, long userId, String link, Long jobId, Long chatUserId) {
        LOGGER.info("Notification {} with body {} to {}", title, body, userId);
        List<String> tokens = getTokensByUser(userId);
        for (String token : tokens) {
            sendFirebaseMessage(title, body, token, link, jobId, chatUserId);
        }
    }

    private void sendFirebaseMessage(String title, String body, String token, String link, Long jobId, Long chatUserId) {
        AndroidConfig androidConfig = AndroidConfig
            .builder()
            .setNotification(AndroidNotification.builder().setSound(DEFAULT_SOUND).setTitle(title).setBody(body).build())
            .build();
        ApnsConfig apnsConfig = ApnsConfig
            .builder()
            .setAps(Aps.builder().setAlert(ApsAlert.builder().setTitle(title).setBody(body).build()).setSound(DEFAULT_SOUND).build())
            .build();
        Message message = Message
            .builder()
            .putData(LINK, link)
            .putData(JOB_ID, jobId == null ? StringUtils.EMPTY : jobId.toString())
            .putData(CHAT_USER_ID, chatUserId == null ? StringUtils.EMPTY : chatUserId.toString())
            .setAndroidConfig(androidConfig)
            .setApnsConfig(apnsConfig)
            .setToken(token)
            .build();
        try {
            String response = FirebaseMessaging.getInstance().send(message);
            LOGGER.info("Message sent {}", response);
        } catch (FirebaseMessagingException e) {
            LOGGER.error(e.getMessage(), e);
        }
    }

    @Override
    public void saveToken(FirebaseDataDTO newData) {
        Optional<FirebaseData> firebaseData = firebaseRepository.findByToken(newData.getToken());
        if (firebaseData.isPresent()) {
            FirebaseData currentData = firebaseData.get();
            if (Long.parseLong(newData.getUserId()) != currentData.getUser().getId()) {
                firebaseRepository.delete(currentData);
                firebaseRepository.save(map(newData));
            }
        } else {
            firebaseRepository.save(map(newData));
        }
    }

    private FirebaseData map(FirebaseDataDTO firebaseDataDTO) {
        User user = userRepository.getOne(Long.parseLong(firebaseDataDTO.getUserId()));
        return new FirebaseData(user, firebaseDataDTO.getToken());
    }

    private List<String> getTokensByUser(Long userId) {
        return firebaseRepository.findByUser_Id(userId).stream().map(FirebaseData::getToken).collect(Collectors.toList());
    }

}
