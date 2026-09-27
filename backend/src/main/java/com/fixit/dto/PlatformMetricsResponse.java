package com.fixit.dto;

import java.util.Map;

public class PlatformMetricsResponse {

    private long totalUsers;
    private long totalCustomers;
    private long totalTechnicians;
    private long totalExperts;
    private long totalProblems;
    private long totalServices;
    private long completedServices;
    private double totalGmv;
    private long pendingTechnicianVerifications;
    private long pendingExpertVerifications;
    private Map<String, Long> problemsByStatus;

    public PlatformMetricsResponse() {
    }

    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalCustomers() {
        return totalCustomers;
    }

    public void setTotalCustomers(long totalCustomers) {
        this.totalCustomers = totalCustomers;
    }

    public long getTotalTechnicians() {
        return totalTechnicians;
    }

    public void setTotalTechnicians(long totalTechnicians) {
        this.totalTechnicians = totalTechnicians;
    }

    public long getTotalExperts() {
        return totalExperts;
    }

    public void setTotalExperts(long totalExperts) {
        this.totalExperts = totalExperts;
    }

    public long getTotalProblems() {
        return totalProblems;
    }

    public void setTotalProblems(long totalProblems) {
        this.totalProblems = totalProblems;
    }

    public long getTotalServices() {
        return totalServices;
    }

    public void setTotalServices(long totalServices) {
        this.totalServices = totalServices;
    }

    public long getCompletedServices() {
        return completedServices;
    }

    public void setCompletedServices(long completedServices) {
        this.completedServices = completedServices;
    }

    public double getTotalGmv() {
        return totalGmv;
    }

    public void setTotalGmv(double totalGmv) {
        this.totalGmv = totalGmv;
    }

    public long getPendingTechnicianVerifications() {
        return pendingTechnicianVerifications;
    }

    public void setPendingTechnicianVerifications(long pendingTechnicianVerifications) {
        this.pendingTechnicianVerifications = pendingTechnicianVerifications;
    }

    public long getPendingExpertVerifications() {
        return pendingExpertVerifications;
    }

    public void setPendingExpertVerifications(long pendingExpertVerifications) {
        this.pendingExpertVerifications = pendingExpertVerifications;
    }

    public Map<String, Long> getProblemsByStatus() {
        return problemsByStatus;
    }

    public void setProblemsByStatus(Map<String, Long> problemsByStatus) {
        this.problemsByStatus = problemsByStatus;
    }
}
