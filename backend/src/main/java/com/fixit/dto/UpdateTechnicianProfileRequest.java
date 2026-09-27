package com.fixit.dto;

import com.fixit.entity.ProblemCategory;

import java.util.List;

public class UpdateTechnicianProfileRequest {

    private String bio;
    private List<ProblemCategory> specialties;
    private Integer experienceYears;
    private Double hourlyRate;
    private String serviceArea;
    private Boolean isAvailable;

    public UpdateTechnicianProfileRequest() {
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

    public Boolean getIsAvailable() {
        return isAvailable;
    }

    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
}
