package com.fixit.dto;

import java.util.ArrayList;
import java.util.List;

public class AiDiagnosisResult {

    private String summary;
    private List<String> possibleCauses = new ArrayList<>();
    private List<String> recommendedActions = new ArrayList<>();
    private String severity;
    private boolean diySuitable;
    private boolean professionalRecommended;
    private List<String> safetyWarnings = new ArrayList<>();

    public AiDiagnosisResult() {
    }

    public AiDiagnosisResult(String summary, List<String> possibleCauses, List<String> recommendedActions,
                             String severity, boolean diySuitable, boolean professionalRecommended,
                             List<String> safetyWarnings) {
        this.summary = summary;
        this.possibleCauses = possibleCauses;
        this.recommendedActions = recommendedActions;
        this.severity = severity;
        this.diySuitable = diySuitable;
        this.professionalRecommended = professionalRecommended;
        this.safetyWarnings = safetyWarnings;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public List<String> getPossibleCauses() {
        return possibleCauses;
    }

    public void setPossibleCauses(List<String> possibleCauses) {
        this.possibleCauses = possibleCauses;
    }

    public List<String> getRecommendedActions() {
        return recommendedActions;
    }

    public void setRecommendedActions(List<String> recommendedActions) {
        this.recommendedActions = recommendedActions;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public boolean isDiySuitable() {
        return diySuitable;
    }

    public void setDiySuitable(boolean diySuitable) {
        this.diySuitable = diySuitable;
    }

    public boolean isProfessionalRecommended() {
        return professionalRecommended;
    }

    public void setProfessionalRecommended(boolean professionalRecommended) {
        this.professionalRecommended = professionalRecommended;
    }

    public List<String> getSafetyWarnings() {
        return safetyWarnings;
    }

    public void setSafetyWarnings(List<String> safetyWarnings) {
        this.safetyWarnings = safetyWarnings;
    }
}
