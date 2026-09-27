package com.fixit.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "expert_profiles")
public class ExpertProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "expert_specialties", joinColumns = @JoinColumn(name = "expert_profile_id"))
    @Column(name = "category")
    @Enumerated(EnumType.STRING)
    private List<ProblemCategory> specialties = new ArrayList<>();

    @Column(name = "session_rate")
    private Double sessionRate = 35.0;

    @Column(name = "available_hours")
    private String availableHours = "Mon - Fri, 2:00 PM - 8:00 PM";

    @Column(name = "meeting_link")
    private String defaultMeetingLink;

    @Enumerated(EnumType.STRING)
    @Column(name = "verification_status", nullable = false)
    private VerificationStatus verificationStatus = VerificationStatus.PENDING;

    @Column(name = "average_rating")
    private Double averageRating = 5.0;

    @Column(name = "session_count")
    private Integer sessionCount = 0;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public ExpertProfile() {
    }

    public ExpertProfile(User user) {
        this.user = user;
        this.sessionRate = 35.0;
        this.verificationStatus = VerificationStatus.PENDING;
        this.averageRating = 5.0;
        this.sessionCount = 0;
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
        if (this.verificationStatus == null) this.verificationStatus = VerificationStatus.PENDING;
        if (this.averageRating == null) this.averageRating = 5.0;
        if (this.sessionCount == null) this.sessionCount = 0;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
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

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
