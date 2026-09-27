package com.fixit.controller;

import com.fixit.dto.ApiResponse;
import com.fixit.dto.CreateMaintenanceReminderDto;
import com.fixit.dto.MaintenanceReminderResponse;
import com.fixit.service.MaintenanceReminderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/maintenance-reminders")
public class MaintenanceReminderController {

    private final MaintenanceReminderService reminderService;

    public MaintenanceReminderController(MaintenanceReminderService reminderService) {
        this.reminderService = reminderService;
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<MaintenanceReminderResponse>>> getMyReminders(
            @AuthenticationPrincipal UserDetails userDetails) {
        List<MaintenanceReminderResponse> list = reminderService.getMyReminders(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Maintenance reminders retrieved", list));
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MaintenanceReminderResponse>> createReminder(
            @Valid @RequestBody CreateMaintenanceReminderDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        MaintenanceReminderResponse response = reminderService.createReminder(dto, userDetails.getUsername());
        return new ResponseEntity<>(ApiResponse.success("Maintenance reminder scheduled", response), HttpStatus.CREATED);
    }

    @PutMapping("/{id}/complete")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<MaintenanceReminderResponse>> completeReminder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        MaintenanceReminderResponse response = reminderService.completeReminder(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Reminder completed and next cycle scheduled", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Void>> deleteReminder(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        reminderService.deleteReminder(id, userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.success("Maintenance reminder deleted", null));
    }
}
