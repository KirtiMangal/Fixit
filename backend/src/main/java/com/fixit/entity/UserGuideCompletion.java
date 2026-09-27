package com.fixit.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "user_guide_completions")
public class UserGuideCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guide_id", nullable = false)
    private DiyGuide guide;

    @Column(name = "completed_at", nullable = false)
    private Instant completedAt;

    public UserGuideCompletion() {
    }

    public UserGuideCompletion(User user, DiyGuide guide) {
        this.user = user;
        this.guide = guide;
        this.completedAt = Instant.now();
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

    public DiyGuide getGuide() {
        return guide;
    }

    public void setGuide(DiyGuide guide) {
        this.guide = guide;
    }

    public Instant getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(Instant completedAt) {
        this.completedAt = completedAt;
    }
}
