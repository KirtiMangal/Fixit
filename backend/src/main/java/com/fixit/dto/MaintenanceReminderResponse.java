package com.fixit.dto;

import com.fixit.entity.MaintenanceReminder;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.ReminderStatus;

import java.time.Instant;

public class MaintenanceReminderResponse {

    private Long id;
    private AssetSummaryResponse asset;
    private String title;
    private String description;
    private ProblemCategory category;
    private Instant dueDate;
    private Integer recurrenceDays;
    private ReminderStatus status;
    private Instant createdAt;
    private Instant completedAt;

    public MaintenanceReminderResponse() {
    }

    public static MaintenanceReminderResponse fromEntity(MaintenanceReminder r) {
        if (r == null) return null;
        MaintenanceReminderResponse dto = new MaintenanceReminderResponse();
        dto.setId(r.getId());
        dto.setAsset(AssetSummaryResponse.fromEntity(r.getAsset()));
        dto.setTitle(r.getTitle());
        dto.setDescription(r.getDescription());
        dto.setCategory(r.getCategory());
        dto.setDueDate(r.getDueDate());
        dto.setRecurrenceDays(r.getRecurrenceDays());
        dto.setStatus(r.getStatus());
        dto.setCreatedAt(r.getCreatedAt());
        dto.setCompletedAt(r.getCompletedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public AssetSummaryResponse getAsset() {
        return asset;
    }

    public void setAsset(AssetSummaryResponse asset) {
        this.asset = asset;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public ProblemCategory getCategory() {
        return category;
    }

    public void setCategory(ProblemCategory category) {
        this.category = category;
    }

    public Instant getDueDate() {
        return dueDate;
    }

    public void setDueDate(Instant dueDate) {
        this.dueDate = dueDate;
    }

    public Integer getRecurrenceDays() {
        return recurrenceDays;
    }

    public void setRecurrenceDays(Integer recurrenceDays) {
        this.recurrenceDays = recurrenceDays;
    }

    public ReminderStatus getStatus() {
        return status;
    }

    public void setStatus(ReminderStatus status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
