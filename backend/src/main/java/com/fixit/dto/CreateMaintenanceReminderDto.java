package com.fixit.dto;

import com.fixit.entity.ProblemCategory;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class CreateMaintenanceReminderDto {

    private Long assetId;

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    @NotNull(message = "Category is required")
    private ProblemCategory category;

    @NotNull(message = "Due date is required")
    private Instant dueDate;

    private Integer recurrenceDays;

    public CreateMaintenanceReminderDto() {
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
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
}
