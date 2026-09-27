package com.fixit.repository;

import com.fixit.entity.LearningSession;
import com.fixit.entity.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningSessionRepository extends JpaRepository<LearningSession, Long> {
    List<LearningSession> findByCustomerEmailOrderByScheduledAtDesc(String customerEmail);
    List<LearningSession> findByExpertEmailOrderByScheduledAtDesc(String expertEmail);
    long countByExpertEmailAndStatus(String expertEmail, SessionStatus status);
}
