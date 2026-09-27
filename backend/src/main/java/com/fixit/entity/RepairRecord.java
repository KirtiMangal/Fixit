package com.fixit.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "repair_records")
public class RepairRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "asset_id")
    private Asset asset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "problem_id")
    private Problem problem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_request_id")
    private ServiceRequest serviceRequest;

    @Enumerated(EnumType.STRING)
    @Column(name = "resolution_type", nullable = false)
    private ResolutionType resolutionType;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String summary;

    @Column(nullable = false)
    private Double cost = 0.0;

    @Column(name = "warranty_days")
    private Integer warrantyDays = 90;

    @Column(name = "repaired_at", nullable = false)
    private Instant repairedAt;

    public RepairRecord() {
    }

    public RepairRecord(User user, Asset asset, Problem problem, ServiceRequest serviceRequest,
                        ResolutionType resolutionType, String title, String summary, Double cost,
                        Integer warrantyDays, Instant repairedAt) {
        this.user = user;
        this.asset = asset;
        this.problem = problem;
        this.serviceRequest = serviceRequest;
        this.resolutionType = resolutionType;
        this.title = title;
        this.summary = summary;
        this.cost = cost != null ? cost : 0.0;
        this.warrantyDays = warrantyDays != null ? warrantyDays : 90;
        this.repairedAt = repairedAt != null ? repairedAt : Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.repairedAt == null) {
            this.repairedAt = Instant.now();
        }
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

    public Asset getAsset() {
        return asset;
    }

    public void setAsset(Asset asset) {
        this.asset = asset;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public ServiceRequest getServiceRequest() {
        return serviceRequest;
    }

    public void setServiceRequest(ServiceRequest serviceRequest) {
        this.serviceRequest = serviceRequest;
    }

    public ResolutionType getResolutionType() {
        return resolutionType;
    }

    public void setResolutionType(ResolutionType resolutionType) {
        this.resolutionType = resolutionType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSummary() {
        return summary;
    }

    public void setSummary(String summary) {
        this.summary = summary;
    }

    public Double getCost() {
        return cost;
    }

    public void setCost(Double cost) {
        this.cost = cost;
    }

    public Integer getWarrantyDays() {
        return warrantyDays;
    }

    public void setWarrantyDays(Integer warrantyDays) {
        this.warrantyDays = warrantyDays;
    }

    public Instant getRepairedAt() {
        return repairedAt;
    }

    public void setRepairedAt(Instant repairedAt) {
        this.repairedAt = repairedAt;
    }
}
