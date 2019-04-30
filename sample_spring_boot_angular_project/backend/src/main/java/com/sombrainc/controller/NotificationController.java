package com.sombrainc.controller;

import com.sombrainc.dto.FirebaseDataDTO;
import com.sombrainc.dto.NotificationDTO;
import com.sombrainc.service.FirebaseService;
import com.sombrainc.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private FirebaseService firebaseService;

    @PostMapping("/api/protected/firebase")
    public void saveToken(@RequestBody FirebaseDataDTO firebaseDataDTO) {
        firebaseService.saveToken(firebaseDataDTO);
    }

    @PostMapping("/api/protected/notifications")
    public void notifications() {
        notificationService.sendUnreadNotifications();
    }

    @GetMapping("/api/protected/notifications")
    public List<NotificationDTO> getAllNotifications(@PageableDefault(size = 50) Pageable pageable) {
        return notificationService.getAllNotificationsForCurrentUser(pageable);
    }

    @PutMapping("/api/protected/notifications/{id}/hide")
    public ResponseEntity markAsRead(@PathVariable(value = "id") Long id) {
        notificationService.markAsReadAndNotify(id);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/api/protected/notifications/hide")
    public ResponseEntity markAllAsRead() {
        notificationService.markAllAsReadAndNotify();
        return ResponseEntity.ok().build();
    }

}
