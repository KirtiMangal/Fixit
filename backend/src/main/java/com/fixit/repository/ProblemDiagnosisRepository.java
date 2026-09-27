package com.fixit.repository;

import com.fixit.entity.ProblemDiagnosis;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProblemDiagnosisRepository extends JpaRepository<ProblemDiagnosis, Long> {
    Optional<ProblemDiagnosis> findByProblemId(Long problemId);
    void deleteByProblemId(Long problemId);
}
