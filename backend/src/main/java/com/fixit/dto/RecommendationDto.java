package com.fixit.dto;

import com.fixit.entity.ProblemCategory;

public class RecommendationDto {

    private String id;
    private String title;
    private String rationale;
    private ProblemCategory category;
    private String urgency; // LOW, MEDIUM, HIGH
    private String actionType; // DIY, MAINTENANCE, INSPECTION
    private String actionUrl;
    private Long assetId;
    private String assetName;

    public RecommendationDto() {
    }

    public RecommendationDto(String id, String title, String rationale, ProblemCategory category,
                             String urgency, String actionType, String actionUrl, Long assetId, String assetName) {
        this.id = id;
        this.title = title;
        this.rationale = rationale;
        this.category = category;
        this.urgency = urgency;
        this.actionType = actionType;
        this.actionUrl = actionUrl;
        this.assetId = assetId;
        this.assetName = assetName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRationale() {
        return rationale;
    }

    public void setRationale(String rationale) {
        this.rationale = rationale;
    }

    public ProblemCategory getCategory() {
        return category;
    }

    public void setCategory(ProblemCategory category) {
        this.category = category;
    }

    public String getUrgency() {
        return urgency;
    }

    public void setUrgency(String urgency) {
        this.urgency = urgency;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public String getActionUrl() {
        return actionUrl;
    }

    public void setActionUrl(String actionUrl) {
        this.actionUrl = actionUrl;
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
}
