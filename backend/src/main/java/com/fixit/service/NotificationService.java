package com.fixit.service;

import com.fixit.dto.NotificationResponse;
import com.fixit.entity.Notification;
import com.fixit.entity.NotificationType;
import com.fixit.entity.User;
import com.fixit.exception.ApiException;
import com.fixit.repository.NotificationRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public NotificationService(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    public Notification sendNotification(User recipient, String title, String message, String link, NotificationType type) {
        Notification notification = new Notification(recipient, title, message, link, type);
        return notificationRepository.save(notification);
    }

    public List<NotificationResponse> getMyNotifications(String email) {
        return notificationRepository.findByRecipientEmailOrderByCreatedAtDesc(email).stream()
                .map(NotificationResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public long getUnreadCount(String email) {
        return notificationRepository.countByRecipientEmailAndIsReadFalse(email);
    }

    public void markAsRead(Long id, String email) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Notification not found"));
        if (!n.getRecipient().getEmail().equalsIgnoreCase(email)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not authorized to access this notification");
        }
        n.setRead(true);
        notificationRepository.save(n);
    }

    public void markAllAsRead(String email) {
        notificationRepository.markAllReadForEmail(email);
    }
}
