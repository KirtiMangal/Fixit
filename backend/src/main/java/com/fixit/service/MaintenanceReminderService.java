package com.fixit.service;

import com.fixit.dto.CreateMaintenanceReminderDto;
import com.fixit.dto.MaintenanceReminderResponse;
import com.fixit.entity.*;
import com.fixit.exception.ApiException;
import com.fixit.repository.AssetRepository;
import com.fixit.repository.MaintenanceReminderRepository;
import com.fixit.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class MaintenanceReminderService {

    private final MaintenanceReminderRepository reminderRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final NotificationService notificationService;

    public MaintenanceReminderService(MaintenanceReminderRepository reminderRepository,
                                      UserRepository userRepository,
                                      AssetRepository assetRepository,
                                      NotificationService notificationService) {
        this.reminderRepository = reminderRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.notificationService = notificationService;
    }

    public List<MaintenanceReminderResponse> getMyReminders(String email) {
        return reminderRepository.findByUserEmailOrderByDueDateAsc(email).stream()
                .map(MaintenanceReminderResponse::fromEntity)
                .collect(Collectors.toList());
    }

    public MaintenanceReminderResponse createReminder(CreateMaintenanceReminderDto dto, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "User not found"));

        Asset asset = null;
        if (dto.getAssetId() != null) {
            asset = assetRepository.findById(dto.getAssetId())
                    .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Asset not found"));
            if (!asset.getOwner().getId().equals(user.getId())) {
                throw new ApiException(HttpStatus.FORBIDDEN, "Cannot link an asset owned by someone else");
            }
        }

        MaintenanceReminder r = new MaintenanceReminder();
        r.setUser(user);
        r.setAsset(asset);
        r.setTitle(dto.getTitle());
        r.setDescription(dto.getDescription());
        r.setCategory(dto.getCategory());
        r.setDueDate(dto.getDueDate());
        r.setRecurrenceDays(dto.getRecurrenceDays());
        r.setStatus(ReminderStatus.PENDING);

        MaintenanceReminder saved = reminderRepository.save(r);
        return MaintenanceReminderResponse.fromEntity(saved);
    }

    public MaintenanceReminderResponse completeReminder(Long id, String email) {
        MaintenanceReminder r = reminderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Reminder not found"));

        if (!r.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not authorized to modify this reminder");
        }

        r.setStatus(ReminderStatus.COMPLETED);
        r.setCompletedAt(Instant.now());
        reminderRepository.save(r);

        // If recurrence is configured, auto-schedule next reminder!
        if (r.getRecurrenceDays() != null && r.getRecurrenceDays() > 0) {
            MaintenanceReminder next = new MaintenanceReminder();
            next.setUser(r.getUser());
            next.setAsset(r.getAsset());
            next.setTitle(r.getTitle());
            next.setDescription(r.getDescription());
            next.setCategory(r.getCategory());
            next.setDueDate(Instant.now().plus(r.getRecurrenceDays(), ChronoUnit.DAYS));
            next.setRecurrenceDays(r.getRecurrenceDays());
            next.setStatus(ReminderStatus.PENDING);
            reminderRepository.save(next);

            notificationService.sendNotification(
                    r.getUser(),
                    "🔄 Maintenance Recurring Task Scheduled",
                    "Completed '" + r.getTitle() + "'. Next reminder scheduled for " + next.getDueDate().toString().substring(0, 10),
                    "/maintenance",
                    NotificationType.MAINTENANCE_DUE
            );
        }

        return MaintenanceReminderResponse.fromEntity(r);
    }

    public void deleteReminder(Long id, String email) {
        MaintenanceReminder r = reminderRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Reminder not found"));

        if (!r.getUser().getEmail().equalsIgnoreCase(email)) {
            throw new ApiException(HttpStatus.FORBIDDEN, "Not authorized to delete this reminder");
        }

        reminderRepository.delete(r);
    }
}
