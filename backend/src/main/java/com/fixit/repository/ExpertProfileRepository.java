package com.fixit.repository;

import com.fixit.entity.ExpertProfile;
import com.fixit.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExpertProfileRepository extends JpaRepository<ExpertProfile, Long> {
    Optional<ExpertProfile> findByUserId(Long userId);
    Optional<ExpertProfile> findByUserEmail(String email);
    List<ExpertProfile> findByVerificationStatus(VerificationStatus status);
}
