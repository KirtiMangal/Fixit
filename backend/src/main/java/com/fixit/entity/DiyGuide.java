package com.fixit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "diy_guides")
public class DiyGuide {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProblemCategory category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DifficultyLevel difficulty = DifficultyLevel.EASY;

    @Column(name = "estimated_minutes")
    private Integer estimatedMinutes = 15;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "diy_guide_tools", joinColumns = @JoinColumn(name = "guide_id"))
    @Column(name = "tool")
    private List<String> requiredTools = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "diy_guide_safety", joinColumns = @JoinColumn(name = "guide_id"))
    @Column(name = "warning", columnDefinition = "TEXT")
    private List<String> safetyWarnings = new ArrayList<>();

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "diy_guide_steps", joinColumns = @JoinColumn(name = "guide_id"))
    @Column(name = "step", columnDefinition = "TEXT")
    private List<String> steps = new ArrayList<>();

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @Column(name = "completion_count")
    private Integer completionCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public DiyGuide() {
    }

    public DiyGuide(String title, String description, ProblemCategory category, DifficultyLevel difficulty,
                    Integer estimatedMinutes, List<String> requiredTools, List<String> safetyWarnings,
                    List<String> steps) {
        this.title = title;
        this.description = description;
        this.category = category;
        this.difficulty = difficulty;
        this.estimatedMinutes = estimatedMinutes;
        this.requiredTools = requiredTools != null ? requiredTools : new ArrayList<>();
        this.safetyWarnings = safetyWarnings != null ? safetyWarnings : new ArrayList<>();
        this.steps = steps != null ? steps : new ArrayList<>();
        this.viewsCount = 0;
        this.completionCount = 0;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        if (this.viewsCount == null) this.viewsCount = 0;
        if (this.completionCount == null) this.completionCount = 0;
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

    public DifficultyLevel getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(DifficultyLevel difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getEstimatedMinutes() {
        return estimatedMinutes;
    }

    public void setEstimatedMinutes(Integer estimatedMinutes) {
        this.estimatedMinutes = estimatedMinutes;
    }

    public List<String> getRequiredTools() {
        return requiredTools;
    }

    public void setRequiredTools(List<String> requiredTools) {
        this.requiredTools = requiredTools;
    }

    public List<String> getSafetyWarnings() {
        return safetyWarnings;
    }

    public void setSafetyWarnings(List<String> safetyWarnings) {
        this.safetyWarnings = safetyWarnings;
    }

    public List<String> getSteps() {
        return steps;
    }

    public void setSteps(List<String> steps) {
        this.steps = steps;
    }

    public Integer getViewsCount() {
        return viewsCount;
    }

    public void setViewsCount(Integer viewsCount) {
        this.viewsCount = viewsCount;
    }

    public Integer getCompletionCount() {
        return completionCount;
    }

    public void setCompletionCount(Integer completionCount) {
        this.completionCount = completionCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
