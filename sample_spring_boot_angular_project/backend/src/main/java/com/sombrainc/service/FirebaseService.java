package com.sombrainc.service;

import com.sombrainc.dto.FirebaseDataDTO;

public interface FirebaseService {

    void sendNotification(String title, String body, long userId, String link);

    void sendNotification(String title, String body, long userId, String link, Long jobId, Long chatUserId);

    void saveToken(FirebaseDataDTO firebaseDataDTO);
}
