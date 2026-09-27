package com.fixit.dto;

import java.util.Map;

public class RepairStatsResponse {

    private long totalRepairs;
    private double totalSpent;
    private double estimatedSavings;
    private Map<String, Long> repairsByType;

    public RepairStatsResponse() {
    }

    public RepairStatsResponse(long totalRepairs, double totalSpent, double estimatedSavings, Map<String, Long> repairsByType) {
        this.totalRepairs = totalRepairs;
        this.totalSpent = totalSpent;
        this.estimatedSavings = estimatedSavings;
        this.repairsByType = repairsByType;
    }

    public long getTotalRepairs() {
        return totalRepairs;
    }

    public void setTotalRepairs(long totalRepairs) {
        this.totalRepairs = totalRepairs;
    }

    public double getTotalSpent() {
        return totalSpent;
    }

    public void setTotalSpent(double totalSpent) {
        this.totalSpent = totalSpent;
    }

    public double getEstimatedSavings() {
        return estimatedSavings;
    }

    public void setEstimatedSavings(double estimatedSavings) {
        this.estimatedSavings = estimatedSavings;
    }

    public Map<String, Long> getRepairsByType() {
        return repairsByType;
    }

    public void setRepairsByType(Map<String, Long> repairsByType) {
        this.repairsByType = repairsByType;
    }
}
