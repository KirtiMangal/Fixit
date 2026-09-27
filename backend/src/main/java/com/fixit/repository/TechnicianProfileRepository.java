package com.fixit.repository;

import com.fixit.entity.ProblemCategory;
import com.fixit.entity.TechnicianProfile;
import com.fixit.entity.VerificationStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TechnicianProfileRepository extends JpaRepository<TechnicianProfile, Long> {

    Optional<TechnicianProfile> findByUserId(Long userId);

    Optional<TechnicianProfile> findByUserEmail(String email);

    List<TechnicianProfile> findByVerificationStatus(VerificationStatus status);

    @Query("SELECT tp FROM TechnicianProfile tp WHERE tp.verificationStatus = :status " +
           "AND (:availableOnly = false OR tp.isAvailable = true) " +
           "AND (:serviceArea IS NULL OR LOWER(tp.serviceArea) LIKE LOWER(CONCAT('%', :serviceArea, '%')))")
    List<TechnicianProfile> searchTechnicians(@Param("status") VerificationStatus status,
                                              @Param("availableOnly") boolean availableOnly,
                                              @Param("serviceArea") String serviceArea);
}
