package com.fixit.dto;

import com.fixit.entity.ProblemCategory;

import java.util.List;

public class UpdateExpertProfileRequest {

    private String bio;
    private List<ProblemCategory> specialties;
    private Double sessionRate;
    private String availableHours;
    private String defaultMeetingLink;

    public UpdateExpertProfileRequest() {
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public List<ProblemCategory> getSpecialties() {
        return specialties;
    }

    public void setSpecialties(List<ProblemCategory> specialties) {
        this.specialties = specialties;
    }

    public Double getSessionRate() {
        return sessionRate;
    }

    public void setSessionRate(Double sessionRate) {
        this.sessionRate = sessionRate;
    }

    public String getAvailableHours() {
        return availableHours;
    }

    public void setAvailableHours(String availableHours) {
        this.availableHours = availableHours;
    }

    public String getDefaultMeetingLink() {
        return defaultMeetingLink;
    }

    public void setDefaultMeetingLink(String defaultMeetingLink) {
        this.defaultMeetingLink = defaultMeetingLink;
    }
}
