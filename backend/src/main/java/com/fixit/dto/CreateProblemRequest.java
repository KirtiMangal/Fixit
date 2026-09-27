package com.fixit.dto;

import com.fixit.entity.ProblemCategory;
import com.fixit.entity.ProblemSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class CreateProblemRequest {

    @NotBlank(message = "Title is required")
    @Size(min = 5, max = 150, message = "Title must be between 5 and 150 characters")
    private String title;

    @NotBlank(message = "Description is required")
    @Size(min = 10, max = 3000, message = "Description must be between 10 and 3000 characters")
    private String description;

    @NotNull(message = "Category is required")
    private ProblemCategory category;

    @Size(max = 100, message = "Subcategory must not exceed 100 characters")
    private String subcategory;

    @NotNull(message = "Severity level is required")
    private ProblemSeverity severity;

    private Long assetId;

    public CreateProblemRequest() {
    }

    public CreateProblemRequest(String title, String description, ProblemCategory category,
                                String subcategory, ProblemSeverity severity) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.subcategory = subcategory;
        this.severity = severity;
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

    public String getSubcategory() {
        return subcategory;
    }

    public void setSubcategory(String subcategory) {
        this.subcategory = subcategory;
    }

    public ProblemSeverity getSeverity() {
        return severity;
    }

    public void setSeverity(ProblemSeverity severity) {
        this.severity = severity;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }
}
