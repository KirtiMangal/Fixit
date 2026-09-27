package com.fixit.repository;

import com.fixit.entity.UserGuideCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserGuideCompletionRepository extends JpaRepository<UserGuideCompletion, Long> {
    List<UserGuideCompletion> findByUserEmailOrderByCompletedAtDesc(String email);
    Optional<UserGuideCompletion> findByUserIdAndGuideId(Long userId, Long guideId);
    boolean existsByUserIdAndGuideId(Long userId, Long guideId);
}
