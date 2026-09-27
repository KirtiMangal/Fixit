package com.fixit.dto;

import com.fixit.entity.RepairRecord;
import com.fixit.entity.ResolutionType;

import java.time.Instant;

public class RepairRecordResponse {

    private Long id;
    private Long assetId;
    private String assetName;
    private Long problemId;
    private Long serviceRequestId;
    private ResolutionType resolutionType;
    private String title;
    private String summary;
    private Double cost;
    private Integer warrantyDays;
    private Instant repairedAt;

    public RepairRecordResponse() {
    }

    public static RepairRecordResponse fromEntity(RepairRecord r) {
        if (r == null) return null;
        RepairRecordResponse dto = new RepairRecordResponse();
        dto.setId(r.getId());
        dto.setAssetId(r.getAsset() != null ? r.getAsset().getId() : null);
        dto.setAssetName(r.getAsset() != null ? r.getAsset().getName() : null);
        dto.setProblemId(r.getProblem() != null ? r.getProblem().getId() : null);
        dto.setServiceRequestId(r.getServiceRequest() != null ? r.getServiceRequest().getId() : null);
        dto.setResolutionType(r.getResolutionType());
        dto.setTitle(r.getTitle());
        dto.setSummary(r.getSummary());
        dto.setCost(r.getCost());
        dto.setWarrantyDays(r.getWarrantyDays());
        dto.setRepairedAt(r.getRepairedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getAssetId() {
        return assetId;
    }

    public void setAssetId(Long assetId) {
        this.assetId = assetId;
    }

    public String getAssetName() {
        return assetName;
    }

    public void setAssetName(String assetName) {
        this.assetName = assetName;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public Long getServiceRequestId() {
        return serviceRequestId;
    }

    public void setServiceRequestId(Long serviceRequestId) {
        this.serviceRequestId = serviceRequestId;
    }

    public ResolutionType getResolutionType() {
        return resolutionType;
    }

    public void setResolutionType(ResolutionType resolutionType) {
        this.resolutionType = resolutionType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Integer getWarrantyDays() {
        return warrantyDays;
    }

    public void setWarrantyDays(Integer warrantyDays) {
        this.warrantyDays = warrantyDays;
    }

    public Instant getRepairedAt() {
        return repairedAt;
    }

    public void setRepairedAt(Instant repairedAt) {
        this.repairedAt = repairedAt;
    }
}
