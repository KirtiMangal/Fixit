package com.fixit.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class CompleteServiceRequestDto {

    @NotNull(message = "Final cost is required")
    @DecimalMin(value = "0.0", message = "Final cost must be zero or positive")
    private Double finalCost;

    @NotBlank(message = "Resolution summary is required")
    private String resolutionSummary;

    public CompleteServiceRequestDto() {
    }

    public CompleteServiceRequestDto(Double finalCost, String resolutionSummary) {
        this.finalCost = finalCost;
        this.resolutionSummary = resolutionSummary;
    }

    public Double getFinalCost() {
        return finalCost;
    }

    public void setFinalCost(Double finalCost) {
        this.finalCost = finalCost;
    }

    public String getResolutionSummary() {
        return resolutionSummary;
    }

    public void setResolutionSummary(String resolutionSummary) {
        this.resolutionSummary = resolutionSummary;
    }
}
