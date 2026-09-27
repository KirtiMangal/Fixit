package com.fixit.repository;

import com.fixit.entity.RepairRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RepairRecordRepository extends JpaRepository<RepairRecord, Long> {

    List<RepairRecord> findByUserEmailOrderByRepairedAtDesc(String email);

    List<RepairRecord> findByAssetIdOrderByRepairedAtDesc(Long assetId);

    @Query("SELECT COALESCE(SUM(r.cost), 0.0) FROM RepairRecord r WHERE r.user.email = :email")
    Double sumCostByUserEmail(@Param("email") String email);

    long countByUserEmail(String email);
}
