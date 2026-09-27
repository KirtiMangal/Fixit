package com.fixit.dto;

import com.fixit.entity.ProblemCategory;
import com.fixit.entity.ServiceRequest;
import com.fixit.entity.ServiceRequestStatus;

import java.time.Instant;

public class ServiceRequestResponse {

    private Long id;
    private UserResponse customer;
    private UserResponse technician;
    private Long problemId;
    private AssetSummaryResponse asset;
    private String title;
    private String description;
    private ProblemCategory category;
    private Instant scheduledDate;
    private Double estimatedCost;
    private Double finalCost;
    private ServiceRequestStatus status;
    private String customerNotes;
    private String resolutionSummary;
    private Instant createdAt;
    private Instant updatedAt;

    public ServiceRequestResponse() {
    }

    public ServiceRequestResponse(Long id, UserResponse customer, UserResponse technician, Long problemId,
                                  AssetSummaryResponse asset, String title, String description,
                                  ProblemCategory category, Instant scheduledDate, Double estimatedCost,
                                  Double finalCost, ServiceRequestStatus status, String customerNotes,
                                  String resolutionSummary, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.customer = customer;
        this.technician = technician;
        this.problemId = problemId;
        this.asset = asset;
        this.title = title;
        this.description = description;
        this.category = category;
        this.scheduledDate = scheduledDate;
        this.estimatedCost = estimatedCost;
        this.finalCost = finalCost;
        this.status = status;
        this.customerNotes = customerNotes;
        this.resolutionSummary = resolutionSummary;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static ServiceRequestResponse fromEntity(ServiceRequest sr) {
        if (sr == null) {
            return null;
        }
        return new ServiceRequestResponse(
                sr.getId(),
                UserResponse.fromEntity(sr.getCustomer()),
                UserResponse.fromEntity(sr.getTechnician()),
                sr.getProblem() != null ? sr.getProblem().getId() : null,
                AssetSummaryResponse.fromEntity(sr.getAsset()),
                sr.getTitle(),
                sr.getDescription(),
                sr.getCategory(),
                sr.getScheduledDate(),
                sr.getEstimatedCost(),
                sr.getFinalCost(),
                sr.getStatus(),
                sr.getCustomerNotes(),
                sr.getResolutionSummary(),
                sr.getCreatedAt(),
                sr.getUpdatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getCustomer() {
        return customer;
    }

    public void setCustomer(UserResponse customer) {
        this.customer = customer;
    }

    public UserResponse getTechnician() {
        return technician;
    }

    public void setTechnician(UserResponse technician) {
        this.technician = technician;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
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

    public Instant getScheduledDate() {
        return scheduledDate;
    }

    public void setScheduledDate(Instant scheduledDate) {
        this.scheduledDate = scheduledDate;
    }

    public Double getEstimatedCost() {
        return estimatedCost;
    }

    public void setEstimatedCost(Double estimatedCost) {
        this.estimatedCost = estimatedCost;
    }

    public Double getFinalCost() {
        return finalCost;
    }

    public void setFinalCost(Double finalCost) {
        this.finalCost = finalCost;
    }

    public ServiceRequestStatus getStatus() {
        return status;
    }

    public void setStatus(ServiceRequestStatus status) {
        this.status = status;
    }

    public String getCustomerNotes() {
        return customerNotes;
    }

    public void setCustomerNotes(String customerNotes) {
        this.customerNotes = customerNotes;
    }

    public String getResolutionSummary() {
        return resolutionSummary;
    }

    public void setResolutionSummary(String resolutionSummary) {
        this.resolutionSummary = resolutionSummary;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
