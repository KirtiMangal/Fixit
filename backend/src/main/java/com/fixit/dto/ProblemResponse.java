package com.fixit.dto;

import com.fixit.entity.Problem;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.ProblemSeverity;
import com.fixit.entity.ProblemStatus;

import java.time.Instant;

public class ProblemResponse {

    private Long id;
    private String title;
    private String description;
    private ProblemCategory category;
    private String subcategory;
    private ProblemSeverity severity;
    private ProblemStatus status;
    private UserResponse createdBy;
    private AssetSummaryResponse asset;
    private ProblemDiagnosisResponse diagnosis;
    private Instant createdAt;
    private Instant updatedAt;

    public ProblemResponse() {
    }

    public ProblemResponse(Long id, String title, String description, ProblemCategory category,
                           String subcategory, ProblemSeverity severity, ProblemStatus status,
                           UserResponse createdBy, AssetSummaryResponse asset,
                           ProblemDiagnosisResponse diagnosis,
                           Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.category = category;
        this.subcategory = subcategory;
        this.severity = severity;
        this.status = status;
        this.createdBy = createdBy;
        this.asset = asset;
        this.diagnosis = diagnosis;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ProblemResponse fromEntity(Problem problem) {
        if (problem == null) {
            return null;
        }

        return new ProblemResponse(
                problem.getId(),
                problem.getTitle(),
                problem.getDescription(),
                problem.getCategory(),
                problem.getSubcategory(),
                problem.getSeverity(),
                problem.getStatus(),
                UserResponse.fromEntity(problem.getCreatedBy()),
                AssetSummaryResponse.fromEntity(problem.getAsset()),
                problem.getDiagnosis() != null ? ProblemDiagnosisResponse.fromEntity(problem.getDiagnosis()) : null,
                problem.getCreatedAt(),
                problem.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public UserResponse getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(UserResponse createdBy) {
        this.createdBy = createdBy;
    }

    public AssetSummaryResponse getAsset() {
        return asset;
    }

    public void setAsset(AssetSummaryResponse asset) {
        this.asset = asset;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public ProblemDiagnosisResponse getDiagnosis() {
        return diagnosis;
    }

    public void setDiagnosis(ProblemDiagnosisResponse diagnosis) {
        this.diagnosis = diagnosis;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
