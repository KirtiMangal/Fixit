package com.fixit.dto;

import com.fixit.entity.LearningSession;
import com.fixit.entity.ProblemCategory;
import com.fixit.entity.SessionStatus;

import java.time.Instant;
import java.util.List;

public class LearningSessionResponse {

    private Long id;
    private UserResponse customer;
    private UserResponse expert;
    private Long problemId;
    private String title;
    private String topic;
    private ProblemCategory category;
    private Instant scheduledAt;
    private Integer durationMinutes;
    private Double sessionPrice;
    private SessionStatus status;
    private String meetingLink;
    private String customerNotes;
    private String expertSummary;
    private List<String> checklistItems;
    private Instant createdAt;

    public LearningSessionResponse() {
    }

    public static LearningSessionResponse fromEntity(LearningSession s) {
        if (s == null) return null;
        LearningSessionResponse r = new LearningSessionResponse();
        r.setId(s.getId());
        r.setCustomer(UserResponse.fromEntity(s.getCustomer()));
        r.setExpert(UserResponse.fromEntity(s.getExpert()));
        r.setProblemId(s.getProblem() != null ? s.getProblem().getId() : null);
        r.setTitle(s.getTitle());
        r.setTopic(s.getTopic());
        r.setCategory(s.getCategory());
        r.setScheduledAt(s.getScheduledAt());
        r.setDurationMinutes(s.getDurationMinutes());
        r.setSessionPrice(s.getSessionPrice());
        r.setStatus(s.getStatus());
        r.setMeetingLink(s.getMeetingLink());
        r.setCustomerNotes(s.getCustomerNotes());
        r.setExpertSummary(s.getExpertSummary());
        r.setChecklistItems(s.getChecklistItems());
        r.setCreatedAt(s.getCreatedAt());
        return r;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getCustomer() {
        return customer;
    }

    public void setCustomer(UserResponse customer) {
        this.customer = customer;
    }

    public UserResponse getExpert() {
        return expert;
    }

    public void setExpert(UserResponse expert) {
        this.expert = expert;
    }

    public Long getProblemId() {
        return problemId;
    }

    public void setProblemId(Long problemId) {
        this.problemId = problemId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public ProblemCategory getCategory() {
        return category;
    }

    public void setCategory(ProblemCategory category) {
        this.category = category;
    }

    public Instant getScheduledAt() {
        return scheduledAt;
    }

    public void setScheduledAt(Instant scheduledAt) {
        this.scheduledAt = scheduledAt;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public Double getSessionPrice() {
        return sessionPrice;
    }

    public void setSessionPrice(Double sessionPrice) {
        this.sessionPrice = sessionPrice;
    }

    public SessionStatus getStatus() {
        return status;
    }

    public void setStatus(SessionStatus status) {
        this.status = status;
    }

    public String getMeetingLink() {
        return meetingLink;
    }

    public void setMeetingLink(String meetingLink) {
        this.meetingLink = meetingLink;
    }

    public String getCustomerNotes() {
        return customerNotes;
    }

    public void setCustomerNotes(String customerNotes) {
        this.customerNotes = customerNotes;
    }

    public String getExpertSummary() {
        return expertSummary;
    }

    public void setExpertSummary(String expertSummary) {
        this.expertSummary = expertSummary;
    }

    public List<String> getChecklistItems() {
        return checklistItems;
    }

    public void setChecklistItems(List<String> checklistItems) {
        this.checklistItems = checklistItems;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
