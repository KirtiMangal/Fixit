package com.fixit.dto;

import com.fixit.entity.ProblemCategory;
import com.fixit.entity.ProblemSeverity;
import com.fixit.entity.ProblemStatus;
import jakarta.validation.constraints.Size;

public class UpdateProblemRequest {

    @Size(min = 5, max = 150, message = "Title must be between 5 and 150 characters")
    private String title;

    @Size(min = 10, max = 3000, message = "Description must be between 10 and 3000 characters")
    private String description;

    private ProblemCategory category;

    @Size(max = 100, message = "Subcategory must not exceed 100 characters")
    private String subcategory;

    private ProblemSeverity severity;

    private ProblemStatus status;

    private Long assetId;

    public UpdateProblemRequest() {
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

    public ProblemStatus getStatus() {
        return status;
    }

    public void setStatus(ProblemStatus status) {
        this.status = status;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }
}
