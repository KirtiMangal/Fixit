package com.fixit.repository;

import com.fixit.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, Long> {

    List<Problem> findByCreatedByIdOrderByCreatedAtDesc(Long userId);

    List<Problem> findByCreatedByEmailOrderByCreatedAtDesc(String email);

    List<Problem> findAllByOrderByCreatedAtDesc();

    long countByAssetId(Long assetId);

    List<Problem> findByAssetIdOrderByCreatedAtDesc(Long assetId);
}
