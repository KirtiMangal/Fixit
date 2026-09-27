package com.fixit.dto;

import com.fixit.entity.DifficultyLevel;
import com.fixit.entity.DiyGuide;
import com.fixit.entity.ProblemCategory;

import java.time.Instant;
import java.util.List;

public class DiyGuideResponse {

    private Long id;
    private String title;
    private String description;
    private ProblemCategory category;
    private DifficultyLevel difficulty;
    private Integer estimatedMinutes;
    private List<String> requiredTools;
    private List<String> safetyWarnings;
    private List<String> steps;
    private Integer viewsCount;
    private Integer completionCount;
    private boolean completedByCurrentUser;
    private Instant createdAt;

    public DiyGuideResponse() {
    }

    public static DiyGuideResponse fromEntity(DiyGuide guide, boolean completedByCurrentUser) {
        if (guide == null) return null;
        DiyGuideResponse r = new DiyGuideResponse();
        r.setId(guide.getId());
        r.setTitle(guide.getTitle());
        r.setDescription(guide.getDescription());
        r.setCategory(guide.getCategory());
        r.setDifficulty(guide.getDifficulty());
        r.setEstimatedMinutes(guide.getEstimatedMinutes());
        r.setRequiredTools(guide.getRequiredTools());
        r.setSafetyWarnings(guide.getSafetyWarnings());
        r.setSteps(guide.getSteps());
        r.setViewsCount(guide.getViewsCount());
        r.setCompletionCount(guide.getCompletionCount());
        r.setCompletedByCurrentUser(completedByCurrentUser);
        r.setCreatedAt(guide.getCreatedAt());
        return r;
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

    public boolean isCompletedByCurrentUser() {
        return completedByCurrentUser;
    }

    public void setCompletedByCurrentUser(boolean completedByCurrentUser) {
        this.completedByCurrentUser = completedByCurrentUser;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
