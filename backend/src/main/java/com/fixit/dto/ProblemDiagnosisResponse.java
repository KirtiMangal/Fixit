package com.fixit.dto;

import com.fixit.entity.ProblemDiagnosis;

import java.time.Instant;
import java.util.List;

public class ProblemDiagnosisResponse {

    private Long id;
    private String summary;
    private List<String> possibleCauses;
    private List<String> recommendedActions;
    private List<String> safetyWarnings;
    private String severity;
    private boolean diySuitable;
    private boolean professionalRecommended;
    private Instant createdAt;

    public ProblemDiagnosisResponse() {
    }

    public ProblemDiagnosisResponse(Long id, String summary, List<String> possibleCauses,
                                  List<String> recommendedActions, List<String> safetyWarnings,
                                  String severity, boolean diySuitable, boolean professionalRecommended,
                                  Instant createdAt) {
        this.id = id;
        this.summary = summary;
        this.possibleCauses = possibleCauses;
        this.recommendedActions = recommendedActions;
        this.safetyWarnings = safetyWarnings;
        this.severity = severity;
        this.diySuitable = diySuitable;
        this.professionalRecommended = professionalRecommended;
        this.createdAt = createdAt;
    }

    public static ProblemDiagnosisResponse fromEntity(ProblemDiagnosis diagnosis) {
        if (diagnosis == null) {
            return null;
        }
        return new ProblemDiagnosisResponse(
                diagnosis.getId(),
                diagnosis.getSummary(),
                diagnosis.getPossibleCauses(),
                diagnosis.getRecommendedActions(),
                diagnosis.getSafetyWarnings(),
                diagnosis.getSeverity(),
                diagnosis.isDiySuitable(),
                diagnosis.isProfessionalRecommended(),
                diagnosis.getCreatedAt()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public List<String> getSafetyWarnings() {
        return safetyWarnings;
    }

    public void setSafetyWarnings(List<String> safetyWarnings) {
        this.safetyWarnings = safetyWarnings;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
