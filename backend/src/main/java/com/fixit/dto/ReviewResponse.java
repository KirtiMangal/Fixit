package com.fixit.dto;

import com.fixit.entity.Review;

import java.time.Instant;

public class ReviewResponse {

    private Long id;
    private UserResponse author;
    private Long targetUserId;
    private Long serviceRequestId;
    private Integer rating;
    private String comment;
    private Instant createdAt;

    public ReviewResponse() {
    }

    public static ReviewResponse fromEntity(Review r) {
        if (r == null) return null;
        ReviewResponse dto = new ReviewResponse();
        dto.setId(r.getId());
        dto.setAuthor(UserResponse.fromEntity(r.getAuthor()));
        dto.setTargetUserId(r.getTargetUser().getId());
        dto.setServiceRequestId(r.getServiceRequest() != null ? r.getServiceRequest().getId() : null);
        dto.setRating(r.getRating());
        dto.setComment(r.getComment());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserResponse getAuthor() {
        return author;
    }

    public void setAuthor(UserResponse author) {
        this.author = author;
    }

    public Long getTargetUserId() {
        return targetUserId;
    }

    public void setTargetUserId(Long targetUserId) {
        this.targetUserId = targetUserId;
    }

    public Long getServiceRequestId() {
        return serviceRequestId;
    }

    public void setServiceRequestId(Long serviceRequestId) {
        this.serviceRequestId = serviceRequestId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
