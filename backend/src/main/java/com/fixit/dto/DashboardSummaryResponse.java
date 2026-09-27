package com.fixit.dto;

import java.util.List;

public class DashboardSummaryResponse {

    private long myThingsCount;
    private long myProblemsCount;
    private long activeServiceRequestsCount;
    private long upcomingRemindersCount;
    private long completedRepairsCount;
    private double totalSpent;
    private double estimatedSavings;
    private List<ServiceRequestResponse> recentRequests;
    private List<RepairRecordResponse> recentRepairs;
    private List<MaintenanceReminderResponse> upcomingReminders;

    public DashboardSummaryResponse() {
    }

    public long getMyThingsCount() {
        return myThingsCount;
    }

    public void setMyThingsCount(long myThingsCount) {
        this.myThingsCount = myThingsCount;
    }

    public long getMyProblemsCount() {
        return myProblemsCount;
    }

    public void setMyProblemsCount(long myProblemsCount) {
        this.myProblemsCount = myProblemsCount;
    }

    public long getActiveServiceRequestsCount() {
        return activeServiceRequestsCount;
    }

    public void setActiveServiceRequestsCount(long activeServiceRequestsCount) {
        this.activeServiceRequestsCount = activeServiceRequestsCount;
    }

    public long getUpcomingRemindersCount() {
        return upcomingRemindersCount;
    }

    public void setUpcomingRemindersCount(long upcomingRemindersCount) {
        this.upcomingRemindersCount = upcomingRemindersCount;
    }

    public long getCompletedRepairsCount() {
        return completedRepairsCount;
    }

    public void setCompletedRepairsCount(long completedRepairsCount) {
        this.completedRepairsCount = completedRepairsCount;
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

    public List<ServiceRequestResponse> getRecentRequests() {
        return recentRequests;
    }

    public void setRecentRequests(List<ServiceRequestResponse> recentRequests) {
        this.recentRequests = recentRequests;
    }

    public List<RepairRecordResponse> getRecentRepairs() {
        return recentRepairs;
    }

    public void setRecentRepairs(List<RepairRecordResponse> recentRepairs) {
        this.recentRepairs = recentRepairs;
    }

    public List<MaintenanceReminderResponse> getUpcomingReminders() {
        return upcomingReminders;
    }

    public void setUpcomingReminders(List<MaintenanceReminderResponse> upcomingReminders) {
        this.upcomingReminders = upcomingReminders;
    }
}
