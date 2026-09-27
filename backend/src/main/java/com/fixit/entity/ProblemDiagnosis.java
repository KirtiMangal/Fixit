package com.fixit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problem_diagnoses")
public class ProblemDiagnosis {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id", nullable = false, unique = true)
    private Problem problem;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "problem_diagnosis_causes", joinColumns = @JoinColumn(name = "diagnosis_id"))
    @Column(name = "cause", columnDefinition = "TEXT")
    private List<String> possibleCauses = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "problem_diagnosis_actions", joinColumns = @JoinColumn(name = "diagnosis_id"))
    @Column(name = "action", columnDefinition = "TEXT")
    private List<String> recommendedActions = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "problem_diagnosis_warnings", joinColumns = @JoinColumn(name = "diagnosis_id"))
    @Column(name = "warning", columnDefinition = "TEXT")
    private List<String> safetyWarnings = new ArrayList<>();

    @Column(nullable = false, length = 20)
    private String severity;

    @Column(name = "diy_suitable", nullable = false)
    private boolean diySuitable;

    @Column(name = "professional_recommended", nullable = false)
    private boolean professionalRecommended;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public ProblemDiagnosis() {
    }

    public ProblemDiagnosis(Problem problem, String summary, List<String> possibleCauses,
                            List<String> recommendedActions, List<String> safetyWarnings,
                            String severity, boolean diySuitable, boolean professionalRecommended) {
        this.problem = problem;
        this.summary = summary;
        this.possibleCauses = possibleCauses != null ? possibleCauses : new ArrayList<>();
        this.recommendedActions = recommendedActions != null ? recommendedActions : new ArrayList<>();
        this.safetyWarnings = safetyWarnings != null ? safetyWarnings : new ArrayList<>();
        this.severity = severity;
        this.diySuitable = diySuitable;
        this.professionalRecommended = professionalRecommended;
    }

    @PrePersist
    protected void onCreate() {
        if (this.createdAt == null) {
            this.createdAt = Instant.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
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
