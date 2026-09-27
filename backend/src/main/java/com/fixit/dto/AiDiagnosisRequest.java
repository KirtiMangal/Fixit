package com.fixit.dto;

public class AiDiagnosisRequest {

    private String title;
    private String description;
    private String category;
    private String severity;
    private String asset_info;

    public AiDiagnosisRequest() {
    }

    public AiDiagnosisRequest(String title, String description, String category, String severity, String asset_info) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.severity = severity;
        this.asset_info = asset_info;
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

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getAsset_info() {
        return asset_info;
    }

    public void setAsset_info(String asset_info) {
        this.asset_info = asset_info;
    }
}
