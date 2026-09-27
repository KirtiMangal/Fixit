package com.fixit.dto;

import com.fixit.entity.ProblemCategory;
import com.fixit.entity.TechnicianProfile;
import com.fixit.entity.VerificationStatus;

import java.time.Instant;
import java.util.List;

public class TechnicianProfileResponse {

    private Long id;
    private UserResponse user;
    private String bio;
    private List<ProblemCategory> specialties;
    private Integer experienceYears;
    private Double hourlyRate;
    private String serviceArea;
    private boolean isAvailable;
    private VerificationStatus verificationStatus;
    private Double averageRating;
    private Integer reviewCount;
    private Instant createdAt;

    public TechnicianProfileResponse() {
    }

    public TechnicianProfileResponse(Long id, UserResponse user, String bio,
                                     List<ProblemCategory> specialties, Integer experienceYears,
                                     Double hourlyRate, String serviceArea, boolean isAvailable,
                                     VerificationStatus verificationStatus, Double averageRating,
                                     Integer reviewCount, Instant createdAt) {
        this.id = id;
        this.user = user;
        this.bio = bio;
        this.specialties = specialties;
        this.experienceYears = experienceYears;
        this.hourlyRate = hourlyRate;
        this.serviceArea = serviceArea;
        this.isAvailable = isAvailable;
        this.verificationStatus = verificationStatus;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
        this.createdAt = createdAt;
    }

    public static TechnicianProfileResponse fromEntity(TechnicianProfile profile) {
        if (profile == null) {
            return null;
        }
        return new TechnicianProfileResponse(
                profile.getId(),
                UserResponse.fromEntity(profile.getUser()),
                profile.getBio(),
                profile.getSpecialties(),
                profile.getExperienceYears(),
                profile.getHourlyRate(),
                profile.getServiceArea(),
                profile.isAvailable(),
                profile.getVerificationStatus(),
                profile.getAverageRating(),
                profile.getReviewCount(),
                profile.getCreatedAt()
        );
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

    public Integer getExperienceYears() {
        return experienceYears;
    }

    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }

    public Double getHourlyRate() {
        return hourlyRate;
    }

    public void setHourlyRate(Double hourlyRate) {
        this.hourlyRate = hourlyRate;
    }

    public String getServiceArea() {
        return serviceArea;
    }

    public void setServiceArea(String serviceArea) {
        this.serviceArea = serviceArea;
    }

    public boolean isAvailable() {
        return isAvailable;
    }

    public void setAvailable(boolean available) {
        isAvailable = available;
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

    public Integer getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Integer reviewCount) {
        this.reviewCount = reviewCount;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
