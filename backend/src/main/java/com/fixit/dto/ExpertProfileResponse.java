package com.fixit.dto;

import com.fixit.entity.ExpertProfile;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.VerificationStatus;

import java.time.Instant;
import java.util.List;

public class ExpertProfileResponse {

    private Long id;
    private UserResponse user;
    private String bio;
    private List<ProblemCategory> specialties;
    private Double sessionRate;
    private String availableHours;
    private String defaultMeetingLink;
    private VerificationStatus verificationStatus;
    private Double averageRating;
    private Integer sessionCount;
    private Instant createdAt;

    public ExpertProfileResponse() {
    }

    public static ExpertProfileResponse fromEntity(ExpertProfile profile) {
        if (profile == null) return null;
        ExpertProfileResponse r = new ExpertProfileResponse();
        r.setId(profile.getId());
        r.setUser(UserResponse.fromEntity(profile.getUser()));
        r.setBio(profile.getBio());
        r.setSpecialties(profile.getSpecialties());
        r.setSessionRate(profile.getSessionRate());
        r.setAvailableHours(profile.getAvailableHours());
        r.setDefaultMeetingLink(profile.getDefaultMeetingLink());
        r.setVerificationStatus(profile.getVerificationStatus());
        r.setAverageRating(profile.getAverageRating());
        r.setSessionCount(profile.getSessionCount());
        r.setCreatedAt(profile.getCreatedAt());
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getUser() {
        return user;
    }

    public void setUser(UserResponse user) {
        this.user = user;
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

    public VerificationStatus getVerificationStatus() {
        return verificationStatus;
    }

    public void setVerificationStatus(VerificationStatus verificationStatus) {
        this.verificationStatus = verificationStatus;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Integer getSessionCount() {
        return sessionCount;
    }

    public void setSessionCount(Integer sessionCount) {
        this.sessionCount = sessionCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
