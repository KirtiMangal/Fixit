package com.fixit.dto;

import com.fixit.entity.Asset;
import com.fixit.entity.ProblemCategory;

import java.time.Instant;
import java.time.LocalDate;

public class AssetResponse {

    private Long id;
    private String name;
    private ProblemCategory category;
    private String brand;
    private String model;
    private LocalDate purchaseDate;
    private LocalDate warrantyEndDate;
    private String notes;
    private String warrantyStatus;
    private long problemCount;
    private Instant createdAt;
    private Instant updatedAt;

    public AssetResponse() {
    }

    public AssetResponse(Long id, String name, ProblemCategory category, String brand, String model,
                         LocalDate purchaseDate, LocalDate warrantyEndDate, String notes,
                         String warrantyStatus, long problemCount, Instant createdAt, Instant updatedAt) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.brand = brand;
        this.model = model;
        this.purchaseDate = purchaseDate;
        this.warrantyEndDate = warrantyEndDate;
        this.notes = notes;
        this.warrantyStatus = warrantyStatus;
        this.problemCount = problemCount;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static AssetResponse fromEntity(Asset asset, long problemCount) {
        if (asset == null) {
            return null;
        }

        String warrantyStatus = calculateWarrantyStatus(asset.getWarrantyEndDate());

        return new AssetResponse(
                asset.getId(),
                asset.getName(),
                asset.getCategory(),
                asset.getBrand(),
                asset.getModel(),
                asset.getPurchaseDate(),
                asset.getWarrantyEndDate(),
                asset.getNotes(),
                warrantyStatus,
                problemCount,
                asset.getCreatedAt(),
                asset.getUpdatedAt()
        );
    }

    private static String calculateWarrantyStatus(LocalDate warrantyEndDate) {
        if (warrantyEndDate == null) {
            return "NO_WARRANTY_INFO";
        }
        LocalDate today = LocalDate.now();
        if (today.isBefore(warrantyEndDate) || today.isEqual(warrantyEndDate)) {
            return "ACTIVE";
        } else {
            return "EXPIRED";
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ProblemCategory getCategory() {
        return category;
    }

    public void setCategory(ProblemCategory category) {
        this.category = category;
    }

    public String getBrand() {
        return brand;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public LocalDate getPurchaseDate() {
        return purchaseDate;
    }

    public void setPurchaseDate(LocalDate purchaseDate) {
        this.purchaseDate = purchaseDate;
    }

    public LocalDate getWarrantyEndDate() {
        return warrantyEndDate;
    }

    public void setWarrantyEndDate(LocalDate warrantyEndDate) {
        this.warrantyEndDate = warrantyEndDate;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public String getWarrantyStatus() {
        return warrantyStatus;
    }

    public void setWarrantyStatus(String warrantyStatus) {
        this.warrantyStatus = warrantyStatus;
    }

    public long getProblemCount() {
        return problemCount;
    }

    public void setProblemCount(long problemCount) {
        this.problemCount = problemCount;
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
