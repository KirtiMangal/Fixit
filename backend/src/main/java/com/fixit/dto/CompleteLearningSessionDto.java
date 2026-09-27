package com.fixit.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.List;

public class CompleteLearningSessionDto {

    @NotBlank(message = "Expert summary is required")
    private String expertSummary;

    private List<String> checklistItems = new ArrayList<>();

    public CompleteLearningSessionDto() {
    }

    public String getExpertSummary() {
        return expertSummary;
    }

    public void setExpertSummary(String expertSummary) {
        this.expertSummary = expertSummary;
    }

    public List<String> getChecklistItems() {
        return checklistItems;
    }

    public void setChecklistItems(List<String> checklistItems) {
        this.checklistItems = checklistItems;
    }
}
